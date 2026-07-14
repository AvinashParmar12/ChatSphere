import clsx from "clsx";
import type { LabelHTMLAttributes, ReactNode } from "react";

interface LabelProps
  extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

const Label = ({
  children,
  className,
  ...props
}: LabelProps) => {
  return (
    <label
      className={clsx(
        "mb-2 block text-sm font-medium text-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;