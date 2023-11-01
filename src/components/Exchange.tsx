"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { type ItemPublicTokenExchangeRequest } from "plaid";
import { db } from "~/server/db";
import { plaidClient } from "~/server/api/plaidConfig";

const Exchange = async (token: string) => {
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
        userId: userId ?? "null",
        name: user?.username ?? user?.firstName,
      },
    });
    await db.items.create({
      data: {
        itemId: generatedId,
        userId: userId ?? "null",
        accessToken: generatedToken,
        transactionCursor: undefined,
        bankName: null,
      },
    });
    return generatedToken;
  } catch (err) {
    // handle error
  }
};

export default Exchange;
