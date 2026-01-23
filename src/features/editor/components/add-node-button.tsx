"use client";

import { memo, useState } from "react";
import { PlusIcon } from "lucide-react";

import { NodeSelector } from "@/components/node-selector";
import { Button } from "@/components/ui/button";

export const AddNodeButton = memo(({ onClick }: { onClick?: () => void }) => {
  const [open, setOpen] = useState(false);

  return (
    <NodeSelector open={open} onOpenChange={setOpen}>
      <Button
        size="icon"
        variant="outline"
        className="bg-background"
        onClick={onClick}
      >
        <PlusIcon />
      </Button>
    </NodeSelector>
  );
});

AddNodeButton.displayName = "AddNodeButton";
