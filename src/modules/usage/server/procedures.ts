import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { getUsagesStatus } from "@/lib/usage";

export const usageRouter = createTRPCRouter({
  status: protectedProcedure.query(async ({ input, ctx }) => {
    try {
      const result = await getUsagesStatus();
      return result;
    } catch {
      return null;
    }
  }),
});
