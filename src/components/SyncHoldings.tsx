"use server";

import { auth } from "@clerk/nextjs";
import { InvestmentsHoldingsGetRequest } from "plaid";
import { plaidClient } from "~/server/api/plaidConfig";
import { db } from "~/server/db";

const SyncHoldings = async (token: string) => {
  const userId = auth().userId ?? "null";

  const request: InvestmentsHoldingsGetRequest = {
    access_token: token,
  };
  try {
    const response = await plaidClient.investmentsHoldingsGet(request);
    const holdings = response.data.holdings;
    const securities = response.data.securities;

    holdings.map(async (holding) => {
      await db.holdings.create({
        data: {
          accountId: holding.account_id,
          costBasis: holding.cost_basis,
          date: holding.institution_price_as_of,
          price: holding.institution_price,
          quantity: holding.quantity,
          securityId: holding.security_id,
          userId: userId,
        },
      });
    });

    securities.map(async (security) => {
      await db.securities.create({
        data: {
          name: security.name,
          securityId: security.security_id,
          ticker: security.ticker_symbol,
          type: security.type,
          closePrice: security.close_price,
          updateDate: security.update_datetime,
          userId: userId,
        },
      });
    });
  } catch (error) {
    // handle error
  }
};

export default SyncHoldings;
