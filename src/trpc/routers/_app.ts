import { inngest } from "@/inngest/client";
import { protectedProcedure, createTRPCRouter } from "../init";
import db from "@/lib/db";

export const appRouter = createTRPCRouter({
  testAi: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "execute/ai"
    })
    return { success: true, message: "AI execution initiated." };
  }),
  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return db.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/hello.world", // event name defined in the function
      data: {
        email: "user@example.com",
      },
    });
    return { success: true, message: "Workflow creation initiated." };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
