import db from "@/lib/db";
import { inngest } from "./client";
import { NonRetriableError } from "inngest";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/features/executions/libs/executor-registry";

export const executeWorkFlow = inngest.createFunction(
  { id: "execute-workflow" },
  { event: "workflows/execute.workflow" },
  async ({ event, step }) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) {
      throw new NonRetriableError("workflowId is required");
    }

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await db.workflow.findFirstOrThrow({
        where: { id: workflowId },
        include: { nodes: true, connections: true },
      });
      return topologicalSort(workflow.nodes, workflow.connections);
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
        step,
      });
    }

    return { workflowId, context };
  },
);
