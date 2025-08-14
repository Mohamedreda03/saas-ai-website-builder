import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const messagesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const messages = await prisma.message.findMany();
    return messages;
  }),
  create: baseProcedure
    .input(
      z.object({
        value: z.string().min(1, "Message is required"),
      })
    )
    .mutation(async ({ input }) => {
      const { value } = input;

      const createdMessage = await prisma.message.create({
        data: {
          content: value,
          role: "USER",
          type: "RESULT",
        },
      });

      await inngest.send({
        name: "run/code.agent",
        data: {
          value: value,
        },
      });

      return createdMessage;
    }),
});
