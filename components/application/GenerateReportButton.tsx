"use client";

import { useState } from "react";

type GenerateReportButtonProps = {
  responseId: string;
};

export function GenerateReportButton({ responseId }: GenerateReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const href = `/api/reports/lifenergy-v1/${encodeURIComponent(responseId)}`;

  return (
    <a
      href={href}
      aria-disabled={isGenerating}
      onClick={(event) => {
        if (isGenerating) {
          event.preventDefault();
          return;
        }

        setIsGenerating(true);
      }}
      className={`rounded-full border border-[#B8860B] px-4 py-2 text-[14px] font-bold text-[#0F2D4A] transition hover:bg-[#B8860B]/10 ${
        isGenerating ? "pointer-events-none cursor-not-allowed opacity-60" : ""
      }`}
    >
      {isGenerating ? "Gerando relatório..." : "Gerar relatório"}
    </a>
  );
}
