import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;

  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "ghost";

  size?: "sm" | "md" | "lg";

  loading?: boolean;
}

const Button = ({
  children,

  variant = "primary",

  size = "md",

  loading = false,

  className,

  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        "rounded-lg font-medium transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed",

        // ==============================
        // Variants
        // ==============================

        {
          "bg-blue-600 text-white hover:bg-blue-700":
            variant === "primary",

          "bg-gray-200 text-gray-900 hover:bg-gray-300":
            variant === "secondary",

          "bg-red-600 text-white hover:bg-red-700":
            variant === "danger",

          "bg-transparent hover:bg-gray-100":
            variant === "ghost",
        },

        // ==============================
        // Sizes
        // ==============================

        {
          "px-3 py-2 text-sm":
            size === "sm",

          "px-4 py-2 text-base":
            size === "md",

          "px-6 py-3 text-lg":
            size === "lg",
        },

        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;