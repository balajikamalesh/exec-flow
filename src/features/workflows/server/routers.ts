import z from "zod";

import db from "@/lib/db";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { PAGINATION } from "@/config/constants";

export const workflowsRouter = createTRPCRouter({
  create: premiumProcedure.mutation(async ({ ctx }) => {
    return db.workflow.create({
      data: {
        name: Array.from({ length: 3 }, () => ["bright","silent","future","code","dream","fast","curious","cloud","logic","signal"][Math.floor(Math.random()*10)]).join(" "),
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
