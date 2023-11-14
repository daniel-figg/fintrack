import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { plaidClient } from "../plaidConfig";
import { AccountsGetRequest } from "plaid";

export const balanceRouter = createTRPCRouter({
  getBalance: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.balance.findMany({
        where: {
          userId: input,
        },
      });
    }),
});
