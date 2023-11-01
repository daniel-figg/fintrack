import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { plaidClient } from "../plaidConfig";

import type {
  Transaction,
  RemovedTransaction,
  TransactionsSyncRequest,
} from "plaid";

export const transactionRouter = createTRPCRouter({
  getData: publicProcedure.query(async ({ ctx, input }) => {
    return await ctx.db.transactions.findMany({
      where: {
        userId: input,
      },
    });
  }),

  sync: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    // Provide a cursor from your database if you've previously
    // received one for the Item. Leave null if this is your
    // first sync call for this Item. The first request will
    // return a cursor.

    const { accessToken, itemId } = await ctx.db.items.findFirstOrThrow({
      where: {
        userId: input,
      },
      select: {
        accessToken: true,
        itemId: true,
      },
    });

    //   let cursor = database.getLatestCursorOrNull(itemId);
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
});
