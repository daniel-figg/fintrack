import { auth } from "@clerk/nextjs";
import { api } from "~/trpc/server";

const userId = auth().userId ?? "null";

const Balance = async () => {
  const accounts = await api.balance.getBalance.query(userId);
  return <div>{accounts.map((account) => account.name)}</div>;
};

export default Balance;
