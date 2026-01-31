import { createTRPCRouter } from "../init";
import { CredentialsRouter } from "@/features/credentials/server/routers";
import { workflowsRouter } from "@/features/workflows/server/routers";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credentials: CredentialsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
