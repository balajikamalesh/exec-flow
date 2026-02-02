"use client";

import { memo, useState } from "react";
import { type NodeProps, type Node, useReactFlow } from "@xyflow/react";

import { BaseExecutionNode } from "../base-execution-node";
import { AnthropicDialog, AnthropicFormType } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchAnthropicRealtimeToken } from "./actions";
import { anthropicChannel } from "@/inngest/channels/anthropic";

type AnthropicNodeData = {
  model?: string;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
  variableName?: string;
};

type AnthropicNodeType = Node<AnthropicNodeData>;

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {
  const [open, setOpen] = useState(false);

  const nodedata = props.data;
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: anthropicChannel().name,
    topic: "status",
    refreshToken: fetchAnthropicRealtimeToken,
  });
  const description = nodedata?.userPrompt
    ? `${nodedata.model ?? "anthropic-2.0-flash"}: ${nodedata.userPrompt.slice(0, 30)}...`
    : "No prompt set";
  const { setNodes } = useReactFlow();

  const handleOpenSettings = () => {
    setOpen(true);
  };

  const handleSubmit = (values: AnthropicFormType) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              credentialId: values.credentialId,
              variableName: values.variableName,
              model: values.model,
              systemPrompt: values.systemPrompt,
              userPrompt: values.userPrompt,
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
      <AnthropicDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        defaultModel={nodedata?.model}
        defaultCredentialId={nodedata?.credentialId}
        defaultVariableName={nodedata?.variableName}
        systemPrompt={nodedata?.systemPrompt}
        userPrompt={nodedata?.userPrompt ?? ""}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        name="Anthorpic"
        status={nodeStatus}
        description={description}
        icon="/logo/anthropic.svg"
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

AnthropicNode.displayName = "AnthropicNode";
