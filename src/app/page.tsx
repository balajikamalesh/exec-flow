"use client";

import { Button } from "@/components/ui/button";
import { Logout } from "./logout";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Page = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: workflows, isPending: isWorkflowsPending } = useQuery(
    trpc.getWorkflows.queryOptions(),
  );

  const { mutate: createWorkflow, isPending: isCreatePending } = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: () => {
        toast.success("Workflow creation initiated");
      },
    }),
  );

  const isPending = isWorkflowsPending || isCreatePending;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-y-6">
      protected server component
      <div>{JSON.stringify(workflows, null, 2)}</div>
      <Button onClick={() => createWorkflow()} disabled={isPending}>
        Create workflow
      </Button>
      <Logout />
    </div>
  );
};

export default Page;
