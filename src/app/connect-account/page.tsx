import { api } from "~/trpc/server";
import LinkButton from "~/components/LinkButton";

const Connect = async () => {
  const linkToken = (await api.link.createLinkToken.query()) ?? "undefined";

  return <LinkButton linkToken={linkToken} />;
};

export default Connect;
