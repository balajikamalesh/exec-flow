"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { memo } from "react";

export const AddNodeButton = memo(({ onClick }: { onClick?: () => void }) => {
  return (
    <Button
      size="icon"
      variant="outline"
      className="bg-background"
      onClick={onClick}
    >
      <PlusIcon />
    </Button>
  );
});

AddNodeButton.displayName = "AddNodeButton";