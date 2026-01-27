"use client";

import { memo, useState } from "react";
import { type NodeProps, type Node, useReactFlow } from "@xyflow/react";

import { BaseExecutionNode } from "../base-execution-node";
import { OpenAIDialog, OpenAIFormType } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchOpenAIRealtimeToken } from "./actions";
import { openaiChannel } from "@/inngest/channels/openai";

type OpenAINodeData = {
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
  variableName?: string;
};

type OpenAINodeType = Node<OpenAINodeData>;

export const OpenAINode = memo((props: NodeProps<OpenAINodeType>) => {
  const [open, setOpen] = useState(false);

  const nodedata = props.data;
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: openaiChannel().name,
    topic: "status",
    refreshToken: fetchOpenAIRealtimeToken,
  });
  const description = nodedata?.userPrompt
    ? `${nodedata.model ?? "gemini-2.0-flash"}: ${nodedata.userPrompt.slice(0, 30)}...`
    : "No prompt set";
  const { setNodes } = useReactFlow();

  const handleOpenSettings = () => {
    setOpen(true);
  };

  const handleSubmit = (values: OpenAIFormType) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
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
      <OpenAIDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        defaultModel={nodedata?.model}
        defaultVariableName={nodedata?.variableName}
        systemPrompt={nodedata?.systemPrompt}
        userPrompt={nodedata?.userPrompt!}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        name="OpenAI"
        status={nodeStatus}
        description={description}
        icon="/logo/openai.svg"
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

OpenAINode.displayName = "OpenAINode";
