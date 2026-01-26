"use client";

import type { ReactNode } from "react";
import { NodeToolbar, Position } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";

import { Button } from "./ui/button";

// UI wrapper that adds common functionality (settings, delete actions, labels)
// around workflow nodes in your visual workflow editor
interface WorkflowNodeProps {
  children: ReactNode;
  showToolbar?: boolean;
  onDelete?: () => void;
  onSettings?: () => void;
  name?: string;
  description?: string;
}

export const WorkflowNode = ({
  children,
  showToolbar = true,
  onDelete,
  onSettings,
  name,
  description,
}: WorkflowNodeProps) => {
  return (
    <>
      {showToolbar && (
        <NodeToolbar>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onSettings && onSettings()}
          >
            <SettingsIcon className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete && onDelete()}
          >
            <TrashIcon className="size-4" />
          </Button>
        </NodeToolbar>
      )}
      {children}
      {name && (
        <NodeToolbar
          position={Position.Bottom}
          isVisible
          className="max-w-50 text-center"
        >
          <p className="font-medium">{name}</p>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </NodeToolbar>
      )}
    </>
  );
};
