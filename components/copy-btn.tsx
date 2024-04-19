import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Button } from "./ui/button";

type CopyBtnProps = {
  value: string | number;
};

export const CopyBtn = ({ value }: CopyBtnProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const onClick = async () => {
    if (value) {
      await navigator.clipboard.writeText(`${value}`);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={!value}
      onClick={onClick}
    >
      {isCopied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
};
