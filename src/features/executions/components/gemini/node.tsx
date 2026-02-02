"use client";

import { memo, useState } from "react";
import { type NodeProps, type Node, useReactFlow } from "@xyflow/react";

import { BaseExecutionNode } from "../base-execution-node";
import { GeminiDialog, GeminiFormType } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchGeminiRealtimeToken } from "./actions";
import { geminiChannel } from "@/inngest/channels/gemini";

type GeminiNodeData = {
  model?: string;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
  variableName?: string;
};

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
  const [open, setOpen] = useState(false);

  const nodedata = props.data;
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: geminiChannel().name,
    topic: "status",
    refreshToken: fetchGeminiRealtimeToken,
  });
  const description = nodedata?.userPrompt
    ? `${nodedata.model ?? "gemini-2.0-flash"}: ${nodedata.userPrompt.slice(0, 30)}...`
    : "No prompt set";
  const { setNodes } = useReactFlow();

  const handleOpenSettings = () => {
    setOpen(true);
  };

  const handleSubmit = (values: GeminiFormType) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              variableName: values.variableName,
              credentialId: values.credentialId,
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
      <GeminiDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        defaultCredentialId={nodedata?.credentialId}
        defaultModel={nodedata?.model}
        defaultVariableName={nodedata?.variableName}
        systemPrompt={nodedata?.systemPrompt}
        userPrompt={nodedata?.userPrompt ?? ""}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        name="Gemini"
        status={nodeStatus}
        description={description}
        icon="/logo/gemini.svg"
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

GeminiNode.displayName = "GeminiNode";
