import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = ({
  error = false,
  className,
  ...props
}: InputProps) => {
  return (
    <input
      className={clsx(
        "w-full rounded-lg border bg-white px-4 py-2 text-sm outline-none transition-colors",

        "placeholder:text-gray-400",

        "focus:ring-2 focus:ring-blue-500",

        {
          "border-gray-300": !error,
          "border-red-500 focus:ring-red-500": error,
        },

        "disabled:cursor-not-allowed disabled:bg-gray-100",

        className
      )}
      {...props}
    />
  );
};

export default Input;