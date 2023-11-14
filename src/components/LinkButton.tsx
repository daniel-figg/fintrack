"use client";

import Exchange from "./Exchange";
import SaveAccounts from "./SaveAccounts";
import SaveBalance from "./SaveBalance";
import SyncHoldings from "./SyncHoldings";
import { Button } from "./ui/button";
import { usePlaidLink } from "react-plaid-link";

type linkButton = {
  linkToken: string;
};

const LinkButton: React.FC<linkButton> = ({ linkToken }) => {
  const { open, ready } = usePlaidLink({
    token: linkToken,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onSuccess: async (public_token, _metadata): Promise<undefined> => {
      // send public_token to server
      const accessToken = (await Exchange(public_token)) ?? "null";
      await SaveAccounts(accessToken);
      await SyncHoldings(accessToken);
      await SaveBalance(accessToken);
    },
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    <Button onClick={() => open()} disabled={!ready} variant="default">
      Connect a bank account
    </Button>
  );
};

export default LinkButton;
