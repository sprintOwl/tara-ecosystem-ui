import { useIsMounted } from "@/hooks/useIsMounted";
import { useConnection } from "@/hooks/useConnection";
import clsx from "clsx";
import { Identicon } from "./ui/metamask-identicon";
import { AddressType, shortenAddress } from "../lib/utils";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export const Address = () => {
  const { isConnected, account, connect } = useConnection();
  const isMounted = useIsMounted();

  return isConnected && isMounted && account ? (
    <Badge variant="outline" className="flex items-center gap-2 p-1">
      <Identicon address={account} diameter={20} />
      <p className={clsx("font-semibold")}>
        {shortenAddress(account as AddressType)}
      </p>
    </Badge>
  ) : (
    <Button color="primary" onClick={connect}>
      Connect Wallet
    </Button>
  );
};
