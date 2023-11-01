import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type AccountsGetRequest } from "plaid";
import { plaidClient } from "../plaidConfig";

export const accountRouter = createTRPCRouter({
  getAccounts: publicProcedure
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
        const response = await plaidClient.accountsGet(request);
        const accounts = response.data.accounts;
        return accounts;
      } catch (error) {
        // handle error
      }
    }),

  //   saveAccounts: publicProcedure
  //     .input(z.string())
  //     .mutation(async ({ ctx, input }) => {
  //       const { accessToken, itemId } = await ctx.db.items.findFirstOrThrow({
  //         where: {
  //           userId: input,
  //         },
  //         select: {
  //           accessToken: true,
  //           itemId: true,
  //         },
  //       });

  //       const request: AccountsGetRequest = {
  //         access_token: accessToken,
  //       };
  //       try {
  //         const response = await plaidClient.accountsGet(request);
  //         const accounts = response.data.accounts;
  //         accounts.map(async (account) => {
  //           await ctx.db.accounts.create({
  //             data: {
  //               accountId: account.account_id,
  //               itemId: itemId,
  //               name: account.name,
  //             },
  //           });
  //         });
  //       } catch (error) {
  //         // handle error
  //       }
  //     }),
});
