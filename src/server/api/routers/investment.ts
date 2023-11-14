import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { plaidClient } from "../plaidConfig";
import { InvestmentsHoldingsGetRequest } from "plaid";

export const investmentRouter = createTRPCRouter({
  getData: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const holdings = await ctx.db.holdings.findMany({
      where: {
        userId: input,
      },
    });
    const securities = await ctx.db.securities.findMany({
      where: {
        userId: input,
      },
    });

    return { holdings, securities };
  }),

  syncHoldings: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      //   const { accessToken } = await ctx.db.items.findFirstOrThrow({
      //     where: {
      //       userId: input,
      //     },
      //     select: {
      //       accessToken: true,
      //     },
      //   });

      const request: InvestmentsHoldingsGetRequest = {
        access_token: input,
      };
      try {
        const response = await plaidClient.investmentsHoldingsGet(request);
        const holdings = response.data.holdings;
        const securities = response.data.securities;

        holdings.map(async (holding) => {
          await ctx.db.holdings.create({
            data: {
              accountId: holding.account_id,
              costBasis: holding.cost_basis,
              date: holding.institution_price_as_of,
              price: holding.institution_price,
              quantity: holding.quantity,
              securityId: holding.security_id,
              userId: input,
            },
          });
        });

        securities.map(async (security) => {
          await ctx.db.securities.create({
            data: {
              name: security.name,
              securityId: security.security_id,
              ticker: security.ticker_symbol,
              type: security.type,
              closePrice: security.close_price,
              updateDate: security.update_datetime,
              userId: input,
            },
          });
        });
      } catch (error) {
        // handle error
      }
    }),
});
