"use client";

import { useConnection } from "@/hooks/useConnection";
import { Button } from "./ui/button";

export const Wallet = () => {
  const { connect } = useConnection();

  return (
    <Button onClick={() => connect()} color="primary" size="lg">
      Connect Wallet
    </Button>
  );
};
