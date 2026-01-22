"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Background,
  Controls,
  MiniMap,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";
import { NodeType } from "@/generated/prisma/enums";
import { ExecuteWorkflowButton } from "./execute-workflow-button";

export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};

export const EditorError = () => {
  return <ErrorView message="Error loading editor" />;
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  const setEditorInstance = useSetAtom(editorAtom);

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const GRID = 20;

  const snapToGrid = (position: { x: number; y: number }) => ({
    x: Math.round(position.x / GRID) * GRID,
    y: Math.round(position.y / GRID) * GRID,
  });

  // for smmoother dragging experience, but align to grid on drag stop
  const onNodeDragStop = (_: any, node: Node) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === node.id ? { ...n, position: snapToGrid(node.position) } : n,
      ),
    );
  };

  const hasManualTrigger = useMemo(() => {
    return nodes.some(node => node.type === NodeType.MANUAL_TRIGGER);
  }, [nodes]);

  return (
    <div className="size-full">
      <ReactFlow
        onInit={setEditorInstance}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeComponents}
        onNodeDragStop={onNodeDragStop}
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
        fitView
      >
        <Background
          gap={20}
          size={1}
        />
        <Controls />
        <MiniMap />
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
        {hasManualTrigger && (
          <Panel position="bottom-center">
            <ExecuteWorkflowButton workflowId={workflowId} />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};
