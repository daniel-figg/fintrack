import DoughnutChart from "~/components/DoughnutChart";
import HorizontalBarChart from "~/components/HorizontalBarChart";
import { type Transaction, columns } from "./columns";
import { DataTable } from "~/components/ui/data-table";
import VerticalBarChart from "~/components/VerticalBarChart";
import { api } from "~/trpc/server";
import { auth } from "@clerk/nextjs";

const getTransactionData = async (): Promise<Transaction[]> => {
  const userId = auth().userId ?? "null";
  await api.transaction.sync.mutate(userId);
  return await api.transaction.getData.query(userId);
};

const getCategoryCount = async () => {
  const userId = auth().userId ?? "null";
  const count = await api.transaction.getCategoryCount.query(userId);

  return {
    datasets: [
      {
        label: "# of Transactions",
        data: count.map((trans) => trans._count.category),
        backgroundColor: [
          "#90a4af",
          "#449f46",
          "#0bbbd4",
          "#e63a36",
          "#ff9704",
          "#7857aa",
          "#ffeb3b",
        ],
        borderColor: [
          "#90a4af",
          "#449f46",
          "#0bbbd4",
          "#e63a36",
          "#ff9704",
          "#7857aa",
          "#ffeb3b",
        ],
        borderWidth: 1,
        maxBarThickness: 50,
      },
    ],
  };
};

const getCategorySum = async () => {
  const userId = auth().userId ?? "null";
  const sum = await api.transaction.getCategorySum.query(userId);
  const labels = sum.map((cat) => cat.category);
  return {
    labels: [""],
    datasets: sum.map((cat, idx) => {
      return {
        label: cat.category,
        data: labels.map(() => cat._sum.amount),
        backgroundColor: colors[idx],
      };
    }),
    // datasets: [
    //   {
    //     data: sum.map((cat) => cat._sum.amount),
    //     backgroundColor: "#90a4af",
    //   },
    // ],
  };
};
const colors = ["#90a4af", "#449f46", "#0bbbd4", "#e63a36", "#ff9704"];
const categoryColors = {
  ENTERTAINMENT: "#90a4af",
  FOOD_AND_DRINK: "#449f46",
  GENERAL_MERCHANDISE: "#0bbbd4",
  LOAN_PAYMENTS: "#e63a36",
  TRANSPORTATION: "#ff9704",
};

const Transactions = async () => {
  const data = await getTransactionData();
  const count = await getCategoryCount();
  const sum = await getCategorySum();

  return (
    <div className="flex flex-col justify-center">
      <div className="container mx-auto flex max-h-80 max-w-full flex-row">
        <div className="flex-1 ">
          <DoughnutChart chartData={count} />
        </div>
        <div className="flex-1">
          <VerticalBarChart chartData={sum} />
        </div>
        <div className="flex-1">
          <HorizontalBarChart chartData={count} />
        </div>
      </div>
      <div className="container mx-auto flex flex-row justify-center py-5">
        {sum.datasets.map((cat) => (
          <div
            key={cat.label}
            className="mx-auto flex flex-row items-center justify-center"
          >
            <div className="h-5 w-5 rounded-full bg-secondary-500"></div>
            <h1 key={cat.label} className={`mx-auto text-[#449f46]`}>
              {cat.label
                ?.toLowerCase()
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </h1>
          </div>
        ))}
      </div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Transactions;
