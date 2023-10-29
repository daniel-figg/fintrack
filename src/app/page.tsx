import { api } from "~/trpc/server";
import LinkButton from "~/components/LinkButton";

export default async function Home() {
  const linkToken = await api.link.createLinkToken.query();

  return (
    <main>
      <h1>BODY</h1>
      <LinkButton linkToken={linkToken} />
    </main>
  );
}
