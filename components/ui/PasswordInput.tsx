"use client";

import { InputHTMLAttributes, useId, useState } from "react";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  inputClassName?: string;
};

export function PasswordInput({
  id,
  className = "",
  inputClassName = "",
  disabled,
  ...props
}: PasswordInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <input
        {...props}
        id={inputId}
        disabled={disabled}
        type={isVisible ? "text" : "password"}
        className={`${inputClassName || "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#0F2A43] focus:ring-4 focus:ring-[#0F2A43]/10"} pr-12`}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsVisible((current) => !current)}
        aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
        aria-pressed={isVisible}
        className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-[#0F2A43] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isVisible ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3l18 18" />
            <path d="M10.6 10.6A2 2 0 0012 14a2 2 0 001.4-.6" />
            <path d="M9.9 4.24A10.8 10.8 0 0112 4c5.5 0 9 5.2 9 8a7.5 7.5 0 01-1.5 3.3" />
            <path d="M6.6 6.6C4.3 8.1 3 10.4 3 12c0 2.8 3.5 8 9 8 1.5 0 2.8-.35 4-.95" />
          </svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 12S5.8 5 12 5s9.5 7 9.5 7-3.3 7-9.5 7-9.5-7-9.5-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}
