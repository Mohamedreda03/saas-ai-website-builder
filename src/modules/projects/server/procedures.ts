import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";

export const projectsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "Project ID is required"),
      })
    )
    .query(async ({ input, ctx }) => {
      const project = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });

      if (!project)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      return project;
    }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const projects = await prisma.project.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return projects;
  }),
  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, "value is required")
          .max(10000, "value is too long"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { value } = input;

      const createdProject = await prisma.project.create({
        data: {
          userId: ctx.auth.userId,
          name: generateSlug(2, {
            format: "kebab",
          }),
          messages: {
            create: {
              content: value,
              role: "USER",
              type: "RESULT",
            },
          },
        },
      });

      await inngest.send({
        name: "run/code.agent",
        data: {
          value: value,
          projectId: createdProject.id,
        },
      });

      return createdProject;
    }),
});
