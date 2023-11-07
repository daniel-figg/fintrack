import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { plaidClient } from "../plaidConfig";

import {
  type Transaction,
  type RemovedTransaction,
  type TransactionsSyncRequest,
} from "plaid";

export const transactionRouter = createTRPCRouter({
  getData: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.transactions.findMany({
      where: {
        userId: input,
      },
      orderBy: {
        date: "desc",
      },
    });
  }),

  getCategoryCount: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.transactions.groupBy({
        by: ["category"],
        _count: {
          category: true,
        },
        where: {
          userId: input,
          amount: {
            gt: 0,
          },
        },
      });
    }),

  getCategorySum: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.transactions.groupBy({
        by: ["category"],
        _sum: {
          amount: true,
        },
        where: {
          userId: input,
          amount: {
            gt: 0,
          },
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
    let cursor = transactionCursor ?? undefined;

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
      const account = ctx.db.accounts.findFirstOrThrow({
        where: {
          accountId: transaction.account_id,
        },
        select: {
          name: true,
        },
      });

      await ctx.db.transactions.create({
        data: {
          transactionId: transaction.transaction_id,
          userId: input,
          account: (await account).name,
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
      const account = ctx.db.accounts.findFirstOrThrow({
        where: {
          accountId: transaction.account_id,
        },
        select: {
          name: true,
        },
      });

      await ctx.db.transactions.update({
        where: {
          transactionId: transaction.transaction_id,
        },
        data: {
          transactionId: transaction.transaction_id,
          account: (await account).name,
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
