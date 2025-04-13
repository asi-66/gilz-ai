
"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-slate-950 dark:text-white transition-bg min-h-screen w-full",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `
          [--aurora:linear-gradient(140deg,#9b87f5_15%,#7E69AB_25%,#D6BCFA_35%,#E5DEFF_50%,#D3E4FD_65%,#6E59A5_75%,#9b87f5_85%)]
          [background-image:var(--aurora)]
          [background-size:200%_200%]
          [background-position:center_center]
          filter blur-[80px] opacity-30 dark:opacity-20
          pointer-events-none
          absolute -inset-[10px]`,

            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
          )}
        ></div>
      </div>
      {children}
    </div>
  );
};
