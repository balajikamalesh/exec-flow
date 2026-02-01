"use client";

import { memo, useState } from "react";
import { type NodeProps, type Node, useReactFlow } from "@xyflow/react";

import { BaseExecutionNode } from "../base-execution-node";
import { DiscordDialog, DiscordFormType } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { discordChannel } from "@/inngest/channels/discord";
import { fetchDiscordRealtimeToken } from "./actions";

type DiscordNodeData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
  const [open, setOpen] = useState(false);

  const nodedata = props.data;
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: discordChannel().name,
    topic: "status",
    refreshToken: fetchDiscordRealtimeToken,
  });
  const description = nodedata?.content
    ? `Send: ${nodedata.content.slice(0, 30)}${nodedata.content.length > 30 ? "..." : ""}`
    : "No content set";
  const { setNodes } = useReactFlow();

  const handleOpenSettings = () => {
    setOpen(true);
  };

  const handleSubmit = (values: DiscordFormType) => {
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
              username: values.username,
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
      <DiscordDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        defaultVariableName={nodedata?.variableName}
        defaultContent={nodedata?.content}
        defaultWebhookUrl={nodedata?.webhookUrl}
        defaultUsername={nodedata?.username}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        name="Discord"
        status={nodeStatus}
        description={description}
        icon="/logo/discord.svg"
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

DiscordNode.displayName = "DiscordNode";
