import DoughnutChart from "~/components/DoughnutChart";
import HorizontalBarChart from "~/components/HorizontalBarChart";
// import { TransactionTable } from "~/components/TransactionTable";
import { type Payment, columns } from "./columns";
import { DataTable } from "~/components/ui/data-table";
import VerticalBarChart from "~/components/VerticalBarChart";

function getTransactionData(): Payment[] {
  // Fetch data from your API here.
  const fake: Payment[] = [];
  for (let i = 1; i <= 100; i++) {
    fake.push({
      id: i.toString(),
      amount: i,
      status: "pending",
      email: "m@example.com",
    });
  }
  return fake;
}

const Transactions = () => {
  const data = getTransactionData();
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
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Transactions;
