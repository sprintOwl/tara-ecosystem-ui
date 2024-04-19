import { cn } from "@/lib/utils";
import { IconSvgProps } from "@/lib/utils";

export type SpinnerProps = {
  className?: string;
} & IconSvgProps;

export const LoadingSpinner: React.FC<IconSvgProps> = ({
  className,
  size = 24,
  width,
  height,
  ...props
}: SpinnerProps) => {
  return (
    <svg
      height={size || height}
      width={size || width}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};
