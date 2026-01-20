import z from "zod";

import db from "@/lib/db";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";

export const workflowsRouter = createTRPCRouter({
  create: premiumProcedure.mutation(async ({ ctx }) => {
    return db.workflow.create({
      data: {
        name: "TODO: New Workflow",
        userId: ctx.auth.user.id,
      },
    });
  }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return db.workflow.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id, // only allow owner to delete
        },
      });
    }),
  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return db.workflow.updateMany({
        where: {
          id: input.id,
          userId: ctx.auth.user.id, // only allow owner to update
        },
        data: {
          name: input.name,
        },
      });
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return db.workflow.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.user.id, // only allow owner to fetch
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return db.workflow.findMany({
      where: {
        userId: ctx.auth.user.id, // only allow owner to fetch
      },
    });
  }),
});
