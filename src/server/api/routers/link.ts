import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  type LinkTokenCreateRequest,
  type ItemPublicTokenExchangeRequest,
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  Products,
  CountryCode,
  Transaction,
  RemovedTransaction,
  TransactionsSyncRequest,
} from "plaid";

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});
export const plaidClient = new PlaidApi(configuration);

export const linkRouter = createTRPCRouter({
  createLinkToken: publicProcedure.query(async () => {
    const request: LinkTokenCreateRequest = {
      user: {
        client_user_id: "user-id",
      },
      client_name: "Personal Finance App",
      products: [Products.Transactions, Products.Investments, Products.Auth],
      country_codes: [CountryCode.Us],
      language: "en",
    };
    try {
      const response = await plaidClient.linkTokenCreate(request);
      const linkToken = response.data.link_token;
      return linkToken;
    } catch (error) {
      // handle error
      console.log(error);
    }
  }),

  sync: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    // Provide a cursor from your database if you've previously
    // received one for the Item. Leave null if this is your
    // first sync call for this Item. The first request will
    // return a cursor.
    //   let cursor = database.getLatestCursorOrNull(itemId);
    const { accessToken, itemId } = await ctx.db.items.findFirstOrThrow({
      where: {
        userId: input,
      },
      select: {
        accessToken: true,
        itemId: true,
      },
    });

    const { transactionCursor } = await ctx.db.items.findFirstOrThrow({
      where: {
        itemId: itemId,
      },
      select: {
        transactionCursor: true,
      },
    });

    // New transaction updates since "cursor"
    let added: Array<Transaction> = [];
    let modified: Array<Transaction> = [];
    // Removed transaction ids
    let removed: Array<RemovedTransaction> = [];
    let hasMore = true;
    let cursor = transactionCursor;

    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const request: TransactionsSyncRequest = {
        access_token: accessToken,
        cursor: cursor,
      };
      const response = await plaidClient.transactionsSync(request);
      const data = response.data;
      console.log(data);

      // Add this page of results
      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);

      hasMore = data.has_more;

      // Update cursor to the next cursor
      cursor = data.next_cursor;
    }

    // Persist cursor and updated data
    added.map(async (transaction) => {
      await ctx.db.transactions.create({
        data: {
          transactionId: transaction.transaction_id,
          userId: input,
          accountId: transaction.account_id,
          category: transaction.personal_finance_category?.primary,
          date: transaction.authorized_date ?? transaction.date,
          name: transaction.merchant_name ?? transaction.name,
          amount: transaction.amount,
          currencyCode: transaction.iso_currency_code ?? "USD",
          confidenceLevel:
            transaction.personal_finance_category?.confidence_level,
        },
      });
    });

    modified.map(async (transaction) => {
      await ctx.db.transactions.update({
        where: {
          transactionId: transaction.transaction_id,
        },
        data: {
          transactionId: transaction.transaction_id,
          accountId: transaction.account_id,
          category: transaction.personal_finance_category?.primary,
          date: transaction.authorized_date ?? transaction.date,
          name: transaction.merchant_name ?? transaction.name,
          amount: transaction.amount,
          currencyCode: transaction.iso_currency_code ?? "USD",
          confidenceLevel:
            transaction.personal_finance_category?.confidence_level,
        },
      });
    });

    removed.map(async (transaction) => {
      await ctx.db.transactions.delete({
        where: {
          transactionId: transaction.transaction_id,
        },
      });
    });

    await ctx.db.items.update({
      where: {
        itemId: itemId,
      },
      data: {
        transactionCursor: cursor,
      },
    });
  }),
  getData: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.transactions.findMany({
      where: {
        userId: input,
      },
    });
  }),

  // exchangePublicToken: publicProcedure
  //   .input(z.string())
  //   .mutation(async ({ ctx, input }) => {
  //     const request: ItemPublicTokenExchangeRequest = {
  //       public_token: input,
  //     };

  //     try {
  //       const response = await plaidClient.itemPublicTokenExchange(request);
  //       const generatedToken = response.data.access_token;
  //       const generatedId = response.data.item_id;
  //       await ctx.db.user.create({
  //         data: {
  //           accessToken: generatedToken,
  //           itemId: generatedId,
  //         },
  //       });
  //     } catch (err) {
  //       // handle error
  //     }
  //   }),
});
