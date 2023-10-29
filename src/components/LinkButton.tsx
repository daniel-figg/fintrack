"use client";

import { Button } from "./ui/button";
import { type PlaidLinkOptions, usePlaidLink } from "react-plaid-link";

interface linkButton {
  linkToken: string | undefined;
}

const LinkButton: React.FC<linkButton> = ({ linkToken }) => {
  const { open, ready } = usePlaidLink<PlaidLinkOptions>({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      // send public_token to server
      console.log("success", public_token, metadata);
    },
  });

  return (
    <Button onClick={() => open()} disabled={!ready} variant="default">
      Connect a bank account
    </Button>
  );
};

export default LinkButton;
