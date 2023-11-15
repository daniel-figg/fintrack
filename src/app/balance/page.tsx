import { auth } from "@clerk/nextjs";
import { api } from "~/trpc/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";

const userId = auth().userId ?? "null";

const Balance = async () => {
  const accounts = await api.balance.getBalance.query(userId);
  return (
    <div className="flex items-center">
      {accounts.map((account) => (
        <Card key={account.accountId} className="m-5 w-full">
          <CardHeader>
            <CardTitle>
              <Link href={`/balance/${account.accountId}`}>{account.name}</Link>
            </CardTitle>
            <CardDescription>
              {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{`Available: \$${account.available}`}</p>
            <p>{`Current: \$${account.current}`}</p>
            <p>{`Limit: \$${account.limit}`}</p>
          </CardContent>
          <CardFooter className="text-xs">
            <p>{`${account.accountId}`}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Balance;
