import DoughnutChart from "~/components/DoughnutChart";
import HorizontalBarChart from "~/components/HorizontalBarChart";
import { TransactionTable } from "~/components/TransactionTable";
import VerticalBarChart from "~/components/VerticalBarChart";

const Transactions = () => {
  return (
    <div className="flex flex-col justify-center">
      <div className="mx-4 flex max-h-80 max-w-full flex-row">
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
      <TransactionTable />
    </div>
  );
};

export default Transactions;
