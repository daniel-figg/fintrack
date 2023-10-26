import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex ">
      <UserButton />
    </main>
  );
}
