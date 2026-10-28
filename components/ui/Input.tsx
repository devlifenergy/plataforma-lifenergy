type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
          {label}
        </span>
      )}

      <input
        className={`w-full rounded-xl border border-slate-300 px-4 py-3 text-base leading-6 text-slate-900 outline-none transition focus:border-[#00838F] focus:ring-2 focus:ring-[#00838F]/20 ${className}`}
        {...props}
      />

      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
}
