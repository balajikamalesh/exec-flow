"use client";

import { memo, useState } from "react";
import { type NodeProps, type Node, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";

import { BaseExecutionNode } from "../base-execution-node";
import { HttpRequestDialog, HttpRequestFormType } from "./dialog";

type HttpRequestNodeData = {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
  [key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const [open, setOpen] = useState(false);

  const nodedata = props.data;
  const nodeStatus = "initial";
  const description = nodedata?.url
    ? `${nodedata.method || "GET"}: ${nodedata.url}`
    : "Not configured";
  const { setNodes } = useReactFlow();

  const handleOpenSettings = () => {
    setOpen(true);
  };

  const handleSubmit = (values: HttpRequestFormType) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              url: values.endpoint,
              method: values.method,
              body: values.body,
            },
          };
        }
        return node;
      })
    );
    setOpen(false);
  }

  return (
    <>
      <HttpRequestDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        defaultEndpoint={nodedata?.url}
        defaultMethod={nodedata?.method}
        defaultBody={nodedata?.body}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        name="HTTP Request"
        status={nodeStatus}
        description={description}
        icon={GlobeIcon}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
