import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import NavBar from "~/components/NavBar";
import { ModeToggle } from "~/components/ui/mode-toggle";

export default async function Home() {
  return (
    <main className="flex ">
      <NavBar />
      <ModeToggle />
      <UserButton />
    </main>
  );
}
