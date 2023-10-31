"use server";

import { auth, currentUser } from "@clerk/nextjs";
import {
  Configuration,
  type ItemPublicTokenExchangeRequest,
  PlaidApi,
  PlaidEnvironments,
} from "plaid";
import { db } from "~/server/db";

const Exchange = async (token: string) => {
  const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
        "PLAID-SECRET": process.env.PLAID_SECRET,
      },
    },
  });
  const plaidClient = new PlaidApi(configuration);

  const request: ItemPublicTokenExchangeRequest = {
    public_token: token,
  };

  const { userId } = auth();
  const user = await currentUser();

  try {
    const response = await plaidClient.itemPublicTokenExchange(request);
    const generatedToken = response.data.access_token;
    const generatedId = response.data.item_id;

    await db.user.create({
      data: {
        userId: userId,
        name: user?.username ?? user?.firstName,
      },
    });
  } catch (err) {
    // handle error
  }
};

export default Exchange;
