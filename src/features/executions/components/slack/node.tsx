"use client";

import { memo, useState } from "react";
import { type NodeProps, type Node, useReactFlow } from "@xyflow/react";

import { BaseExecutionNode } from "../base-execution-node";
import { SlackDialog, SlackFormType } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { slackChannel } from "@/inngest/channels/slack";
import { fetchSlackRealtimeToken } from "./actions";

type SlackNodeData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
};

type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {
  const [open, setOpen] = useState(false);

  const nodedata = props.data;
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: slackChannel().name,
    topic: "status",
    refreshToken: fetchSlackRealtimeToken,
  });
  const description = nodedata?.content
    ? `Send: ${nodedata.content.slice(0, 30)}${nodedata.content.length > 30 ? "..." : ""}`
    : "No content set";
  const { setNodes } = useReactFlow();

  const handleOpenSettings = () => {
    setOpen(true);
  };

  const handleSubmit = (values: SlackFormType) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              variableName: values.variableName,
              webhookUrl: values.webhookUrl,
              content: values.content,
            },
          };
        }
        return node;
      }),
    );
    setOpen(false);
  };

  return (
    <>
      <SlackDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        defaultVariableName={nodedata?.variableName}
        defaultContent={nodedata?.content}
        defaultWebhookUrl={nodedata?.webhookUrl}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        name="Slack"
        status={nodeStatus}
        description={description}
        icon="/logo/slack.svg"
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

SlackNode.displayName = "SlackNode";
