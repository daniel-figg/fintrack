import DoughnutChart from "~/components/DoughnutChart";
import HorizontalBarChart from "~/components/HorizontalBarChart";
import { type Payment, columns } from "./columns";
import { DataTable } from "~/components/ui/data-table";
import VerticalBarChart from "~/components/VerticalBarChart";
import { api } from "~/trpc/server";
import { auth } from "@clerk/nextjs";

const getTransactionData = async () => {
  const { userId } = auth();
  await api.link.sync.mutate(userId);
  return await api.link.getData.query(userId);
};

const Transactions = () => {
  const data = getTransactionData();
  console.log(data);

  return (
    <div className="flex flex-col justify-center">
      <div className="mx-auto flex max-h-80 max-w-full flex-row">
        <div className="flex-1">
          <DoughnutChart />
        </div>
        <div className="flex-1">
          <VerticalBarChart />
        </div>
        <div className="flex-1">
          <HorizontalBarChart />
        </div>
      </div>
      <div className="container mx-auto py-10">
        {/* <DataTable columns={columns} data={data} /> */}
      </div>
    </div>
  );
};

export default Transactions;
