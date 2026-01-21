import z from "zod";
import type { Node, Edge } from "@xyflow/react";

import db from "@/lib/db";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { PAGINATION } from "@/config/constants";
import { NodeType } from "@/generated/prisma/enums";

export const workflowsRouter = createTRPCRouter({
  create: premiumProcedure.mutation(async ({ ctx }) => {
    return db.workflow.create({
      data: {
        name: Array.from(
          { length: 3 },
          () =>
            [
              "bright",
              "silent",
              "future",
              "code",
              "dream",
              "fast",
              "curious",
              "cloud",
              "logic",
              "signal",
            ][Math.floor(Math.random() * 10)],
        ).join(" "),
        userId: ctx.auth.user.id,
        nodes: {
          create: {
            type: NodeType.INITIAL,
            position: { x: 0, y: 0 },
            name: NodeType.INITIAL,
          },
        },
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
    .input(
      z.object({
        id: z.string(),
        name: z
          .string()
          .min(2, { message: "Workflow name must be at least 2 characters" })
          .max(100, {
            message: "Workflow name must be at most 100 characters",
          }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return db.workflow.update({
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
      const workflow = await db.workflow.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.auth.user.id, // only allow owner to fetch
        },
        include: {
          nodes: true,
          connections: true,
        },
      });

      // transform database nodes to react-flow compatible nodes
      const nodes: Node[] = workflow.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position as { x: number; y: number },
        data: (node.data as Record<string, unknown>) || {},
      }));

      // transform database connections to react-flow compatible edges
      const edges: Edge[] = workflow.connections.map((connection) => ({
        id: connection.id,
        source: connection.fromNodeId,
        target: connection.toNodeId,
        sourceHandle: connection.fromOutput,
        targetHandle: connection.toInput,
      }));

      return { id: workflow.id, name: workflow.name, nodes, edges };
    }),
  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        db.workflow.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.auth.user.id,
            name: { contains: search, mode: "insensitive" },
          },
          orderBy: { updatedAt: "desc" },
        }),
        db.workflow.count({
          where: {
            userId: ctx.auth.user.id,
            name: { contains: search, mode: "insensitive" },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});
