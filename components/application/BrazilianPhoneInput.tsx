"use client";

import { useState } from "react";
import { formatBrazilianPhone } from "@/lib/validation";

type Props = {
  name: string;
  label: string;
  defaultValue?: string;
  disabled?: boolean;
};

export function BrazilianPhoneInput({ name, label, defaultValue = "", disabled = false }: Props) {
  const [value, setValue] = useState(formatBrazilianPhone(defaultValue));
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        name={name}
        value={value}
        onChange={(event) => setValue(formatBrazilianPhone(event.target.value))}
        disabled={disabled}
        inputMode="tel"
        autoComplete="tel"
        maxLength={15}
        placeholder="(11) 99999-9999"
        pattern="\(\d{2}\) \d{4,5}-\d{4}"
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0F2D4A] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      />
    </label>
  );
}
