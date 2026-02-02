import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useCredentialsParams } from "./use-credentials-params";
import { CredentialType } from "@/generated/prisma/enums";

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

// Hook to fetch credentials with suspense
export const useSuspenseCredentials = () => {
  const trpc = useTRPC();
  const [params] = useCredentialsParams();

  return useSuspenseQuery(trpc.credentials.getAll.queryOptions(params));
};

// Hook to create a new credential
export const useCreateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: (newCredential) => {
        toast.success(`Credential created successfully: ${newCredential.name}`);
        queryClient.invalidateQueries(trpc.credentials.getAll.queryOptions({}));
      },
      onError: (error) => {
        toast.error(
          `Failed to create credential: ${getErrorMessage(error.message)}`,
        );
      },
    }),
  );
};

// Hook to delete a credential
export const useRemoveCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: () => {
        toast.success(`Credential deleted successfully.`);
        queryClient.invalidateQueries(trpc.credentials.getAll.queryOptions({}));
      },
      onError: (error) => {
        toast.error(
          `Failed to delete credential: ${getErrorMessage(error.message)}`,
        );
      },
    }),
  );
};

// Hook to fetch a single credential using suspense
export const useSuspenseCredential = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }));
};

// Hook to update credential
export const useUpdateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential saved successfully`);
        queryClient.invalidateQueries(trpc.credentials.getAll.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => {
        toast.error(
          `Failed to save credential: ${getErrorMessage(error.message)}`,
        );
      },
    }),
  );
};

// Hook to fetch credential by types
export const useCredentialsByType = (type: CredentialType) => {
  const trpc = useTRPC();
  return useQuery(trpc.credentials.getByType.queryOptions({ type }));
};
