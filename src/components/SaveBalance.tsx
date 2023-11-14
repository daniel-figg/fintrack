"use server";

import { auth } from "@clerk/nextjs";
import { AccountsGetRequest } from "plaid";
import { plaidClient } from "~/server/api/plaidConfig";
import { db } from "~/server/db";

const SaveBalance = async (token: string) => {
  const userId = auth().userId ?? "null";

  const request: AccountsGetRequest = {
    access_token: token,
  };
  try {
    const response = await plaidClient.accountsBalanceGet(request);
    const accounts = response.data.accounts;
    accounts.map(async (account) => {
      await db.balance.create({
        data: {
          accountId: account.account_id,
          available: account.balances.available,
          current: account.balances.current,
          name: account.name ?? account.official_name,
          type: account.type,
          limit: account.balances.limit,
          userId: userId,
        },
      });
    });
  } catch (error) {
    // handle error
  }
};

export default SaveBalance;
