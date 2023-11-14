import { auth } from "@clerk/nextjs";
import { api } from "~/trpc/server";

const userId = auth().userId ?? "null";

const Investments = async () => {
  // await api.investment.syncHoldings.query(userId);
  const data = await api.investment.getData.query(userId);
  console.log(data);
  return <div>hello</div>;
};

export default Investments;
