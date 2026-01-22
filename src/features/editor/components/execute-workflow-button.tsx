import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";
import { FlaskRoundIcon } from "lucide-react";

type ExecuteWorkflowButtonProps = {
  workflowId: string;
};

export const ExecuteWorkflowButton = ({
  workflowId,
}: ExecuteWorkflowButtonProps) => {
  const { mutate: executeWorkflow, isPending } = useExecuteWorkflow();

  const handleExecute = () => {
    executeWorkflow({ id: workflowId });
  };

  return (
    <Button size="lg" onClick={handleExecute} disabled={isPending}>
      <FlaskRoundIcon className="size-4" />
      Execute Workflow
    </Button>
  );
};
