import { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";

import { BaseTriggerNode } from "../base-trigger-node";
import { StripeTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchStripeTriggerRealtimeToken } from "./actions";

export const StripeTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "stripe-trigger-execution",
    topic: "status",
    refreshToken: fetchStripeTriggerRealtimeToken,
  });
  const handleOpenSettings = () => {
    setOpen(true);
  };

  return (
    <>
      <StripeTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        icon="/logo/stripe.svg"
        name="Stripe"
        description="Execute when a stripe event is captured"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

StripeTriggerNode.displayName = "StripeTriggerNode";
