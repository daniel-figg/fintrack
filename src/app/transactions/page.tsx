import { TransactionTable } from "~/components/TransactionTable";

const Transactions = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex h-80 flex-row gap-10">
        <div>CHART 1</div>
        <div>CHART 2</div>
      </div>
      <TransactionTable />
    </div>
  );
};

export default Transactions;
