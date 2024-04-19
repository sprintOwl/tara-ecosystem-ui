import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortenAddress = (address: string): string => {
  if (!address) {
    return address;
  }
  return shortenString(address);
};

export const shortenString = (str: string) => {
  return str.substring(0, 6) + "-" + str.substring(str.length - 4);
};

export type AddressType = `0x${string}`;
