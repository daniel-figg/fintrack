import { createTRPCRouter } from "~/server/api/trpc";
import { linkRouter } from "./routers/link";
import { transactionRouter } from "./routers/transaction";
import { accountRouter } from "./routers/account";
import { investmentRouter } from "./routers/investment";
import { balanceRouter } from "./routers/balance";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  link: linkRouter,
  transaction: transactionRouter,
  account: accountRouter,
  investment: investmentRouter,
  balance: balanceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
