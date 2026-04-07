import { cn } from "@/lib/utils";
import { usePromiseTracker } from "react-promise-tracker";

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const LoadingSpinner = ({
  size = 48,
  className,
  ...props
}: ISVGProps) => {
  const { promiseInProgress } = usePromiseTracker();

  if (!promiseInProgress) {
    return null;
  }

  return (
    <div className="bg-background/50 fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("text-primary animate-spin", className)}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
};
