import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Card = ({
  children,
  className,
  ...props
}: CardProps) => {
  return (
    <div
      className={clsx(
        "rounded-xl border border-gray-200 bg-white p-6 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;