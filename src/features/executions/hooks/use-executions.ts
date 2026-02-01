import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useExecutionsParams } from "./use-executions-params";

// Helper to extract user-friendly error messages
const getErrorMessage = (message: string): string => {
  try {
    const parsed = JSON.parse(message);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((err) => err.message).join(", ");
    }
  } catch {
    return "something went wrong";
  }
  return message;
};

// Hook to fetch executions with suspense
export const useSuspenseExecutions = () => {
  const trpc = useTRPC();
  const [params] = useExecutionsParams();

  return useSuspenseQuery(trpc.executions.getAll.queryOptions(params));
};

// Hook to fetch a single execution using suspense
export const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.executions.getOne.queryOptions({ id }));
};
