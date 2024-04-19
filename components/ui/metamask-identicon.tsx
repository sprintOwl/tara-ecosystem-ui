import React, { useEffect, useRef } from "react";
import jazzicon from "@metamask/jazzicon";

export const Identicon = ({
  address,
  diameter = 28,
}: {
  address: string;
  diameter?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (address && ref.current) {
      const numericAddress = parseInt(address.slice(2, 10), 16);
      const icon = (jazzicon as any)(diameter, numericAddress);
      ref.current.innerHTML = "";
      ref.current.appendChild(icon);
    }
  }, [address, diameter]);

  return <div ref={ref} />;
};
