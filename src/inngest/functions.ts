import db from "@/lib/db";
import { NonRetriableError } from "inngest";

import { inngest } from "./client";
import { topologicalSort } from "./utils";
import { ExecutionStatus, NodeType } from "@/generated/prisma";
import { getExecutor } from "@/features/executions/libs/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { geminiChannel } from "./channels/gemini";
import { anthropicChannel } from "./channels/anthropic";
import { openaiChannel } from "./channels/openai";
import { discordChannel } from "./channels/discord";
import { slackChannel } from "./channels/slack";

export const executeWorkFlow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: process.env.NODE_ENV === "production" ? 3 : 0,
    onFailure: async ({ event }) => {
      return db.execution.update({
        where: {
          inngestEventId: event.data.event.id,
        },
        data: {
          status: ExecutionStatus.FAILED,
          completedAt: new Date(),
          error: event.data.error.message,
          errorStack: event.data.error.stack,
        },
      });
    },
  },
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      geminiChannel(),
      anthropicChannel(),
      openaiChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      discordChannel(),
      slackChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const inngestEventId = event.id;
    const workflowId = event.data.workflowId;

    if (!inngestEventId || !workflowId) {
      throw new NonRetriableError("EventId or workflowId is missing");
    }

    await step.run("create-execution", async () => {
      await db.execution.create({
        data: {
          inngestEventId,
          workflowId,
        },
      });
    });

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await db.workflow.findFirstOrThrow({
        where: { id: workflowId },
        include: { nodes: true, connections: true },
      });
      return topologicalSort(workflow.nodes, workflow.connections);
    });

    const userId = await step.run("get-user-id", async () => {
      const workflow = await db.workflow.findFirstOrThrow({
        where: { id: workflowId },
        select: { userId: true },
      });
      return workflow.userId;
    });

    // Initialize context with any initial data provided in the event
    let context = event.data.initialData || {};

    // Execute each node in order
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        userId,
        step,
        publish,
      });
    }

    await step.run("finalize-execution", async () => {
      await db.execution.update({
        where: { inngestEventId, workflowId },
        data: {
          status: ExecutionStatus.SUCCESS,
          completedAt: new Date(),
          output: context,
        },
      });
    });

    return { workflowId, context };
  },
);
