"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const SubscriptionsPage = () => {
  const trpc = useTRPC();
  const textAI = useMutation(
    trpc.testAi.mutationOptions({
      onSuccess: (data) => {
        toast.success("AI Test Success:");
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    }),
  );

  return (
    <Button onClick={() => textAI.mutate()}>Click to test subscription</Button>
  );
};

export default SubscriptionsPage;
