import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export const signInGoogle = async (callback: () => void) => {
  await authClient.signIn.social(
    {
      provider: "google",
    },
    {
      onSuccess: () => {
        toast.success("Logged in successfully with Google!");
        callback();
      },
      onError: () => {
        toast.error("Login failed");
      },
    },
  );
};
