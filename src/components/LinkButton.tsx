"use client";

import Exchange from "./Exchange";
import { Button } from "./ui/button";
import { type PlaidLinkOptions, usePlaidLink } from "react-plaid-link";

interface linkButton {
  linkToken: string | undefined;
}

const LinkButton: React.FC<linkButton> = ({ linkToken }) => {
  const { open, ready } = usePlaidLink<PlaidLinkOptions>({
    token: linkToken,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onSuccess: async (public_token, _metadata): Promise<undefined> => {
      // send public_token to server
      await Exchange(public_token);
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
