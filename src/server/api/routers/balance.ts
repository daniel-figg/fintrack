import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { plaidClient } from "../plaidConfig";
import { AccountsGetRequest } from "plaid";

export const balanceRouter = createTRPCRouter({
  getBalance: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { accessToken } = await ctx.db.items.findFirstOrThrow({
        where: {
          userId: input,
        },
        select: {
          accessToken: true,
        },
      });

      const request: AccountsGetRequest = {
        access_token: accessToken,
      };
      try {
        const response = await plaidClient.accountsBalanceGet(request);
        const accounts = response.data.accounts;
        return accounts;
      } catch (error) {
        // handle error
      }
    }),
});
