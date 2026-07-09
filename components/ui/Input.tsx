type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-semibold text-slate-700">
          {label}
        </span>
      )}

      <input
        className={`w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20 ${className}`}
        {...props}
      />

      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
}