"use client";

import { useState } from "react";

type GenerateReportButtonProps = {
  responseId: string;
  allowRegenerate?: boolean;
};

export function GenerateReportButton({
  responseId,
  allowRegenerate = false,
}: GenerateReportButtonProps) {
  const [activeAction, setActiveAction] = useState<"generate" | "regenerate" | null>(null);
  const href = `/api/reports/lifenergy-v1/${encodeURIComponent(responseId)}`;
  const regenerateHref = `${href}?regenerate=1`;

  const isBusy = Boolean(activeAction);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={href}
        aria-disabled={isBusy}
        onClick={(event) => {
          if (isBusy) {
            event.preventDefault();
            return;
          }

          setActiveAction("generate");
        }}
        className={`rounded-full border border-[#B8860B] px-4 py-2 text-[14px] font-bold text-[#0F2D4A] transition hover:bg-[#B8860B]/10 ${
          isBusy ? "pointer-events-none cursor-not-allowed opacity-60" : ""
        }`}
      >
        {activeAction === "generate" ? "Gerando relatório..." : "Gerar relatório"}
      </a>

      {allowRegenerate ? (
        <a
          href={regenerateHref}
          aria-disabled={isBusy}
          onClick={(event) => {
            if (isBusy) {
              event.preventDefault();
              return;
            }

            setActiveAction("regenerate");
          }}
          className={`rounded-full border border-slate-300 px-4 py-2 text-[14px] font-bold text-slate-700 transition hover:bg-slate-50 ${
            isBusy ? "pointer-events-none cursor-not-allowed opacity-60" : ""
          }`}
        >
          {activeAction === "regenerate" ? "Regenerando..." : "Regenerar"}
        </a>
      ) : null}
    </div>
  );
}
