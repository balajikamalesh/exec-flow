/* eslint-disable */
import toposort from "toposort";
import { Connection, Node } from "@/generated/prisma/client";
import { inngest } from "./client";
import { createId } from "@paralleldrive/cuid2";

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[],
): Node[] => {
  if (connections.length === 0) {
    // No connections, return nodes as is
    return nodes;
  }

  // Build edges for toposort
  const edges: [string, string][] = connections.map((connection) => [
    connection.fromNodeId,
    connection.toNodeId,
  ]);

  // Identify isolated nodes
  const connectedNodeIds = new Set<string>();
  for (const connection of connections) {
    connectedNodeIds.add(connection.fromNodeId);
    connectedNodeIds.add(connection.toNodeId);
  }

  // Add isolated nodes as self-loops
  for (const node of nodes) {
    if (!connectedNodeIds.has(node.id)) {
      edges.push([node.id, node.id]); // Self-loop to include isolated nodes
    }
  }

  let sortedNodeIds: string[];
  try {
    sortedNodeIds = toposort(edges);
    sortedNodeIds = [...new Set(sortedNodeIds)]; // Remove duplicates while preserving order
  } catch (e) {
    if (e instanceof Error && e.message.includes("Cyclic")) {
      throw new Error(`Workflow has cyclic dependencies among nodes.`);
    }
    return nodes;
  }

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  return sortedNodeIds
    .map((nodeId) => nodeMap.get(nodeId)!)
    .filter((node): node is Node => node !== undefined);
};

export const sendWorkflowExecution = async (data: {
  workflowId: string;
  [key: string]: any;
}) => {
  return inngest.send({
    name: "workflows/execute.workflow",
    data,
    id: createId(),
  });
};
