type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-[#0F2D4A] text-white hover:opacity-90",
    secondary:
      "border border-[#0F2D4A] bg-white text-[#0F2D4A] hover:bg-slate-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      className={`rounded-xl px-5 py-3 font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}