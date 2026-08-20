"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";

type GenerateReportButtonProps = {
  responseId: string;
  allowRegenerate?: boolean;
};

type ReportDownload = {
  blob: Blob;
  fileName: string;
};

const REPORT_BUTTON_VERSION = "1.3.8";

function getFileNameFromContentDisposition(contentDisposition: string | null) {
  if (!contentDisposition) {
    return "Relatorio_Lifenergy.docx";
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1].trim());
    } catch {
      return utf8Match[1].trim();
    }
  }

  const fallbackMatch = contentDisposition.match(/filename="([^"]+)"/i);
  if (fallbackMatch?.[1]) {
    return fallbackMatch[1].trim();
  }

  return "Relatorio_Lifenergy.docx";
}

async function fetchReport(url: string): Promise<ReportDownload> {
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.error || "Erro ao gerar relatório.");
    }

    const text = await response.text().catch(() => "");
    throw new Error(text || "Erro ao gerar relatório.");
  }

  const blob = await response.blob();

  if (!blob.size) {
    throw new Error("O relatório foi gerado sem conteúdo para download.");
  }

  return {
    blob,
    fileName: getFileNameFromContentDisposition(
      response.headers.get("content-disposition")
    ),
  };
}

function startBrowserDownload(report: ReportDownload) {
  const objectUrl = window.URL.createObjectURL(report.blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = report.fileName;
  anchor.rel = "noopener";
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    window.URL.revokeObjectURL(objectUrl);
  }, 1000);
}

export function GenerateReportButton({
  responseId,
  allowRegenerate = false,
}: GenerateReportButtonProps) {
  const [activeAction, setActiveAction] = useState<"generate" | "regenerate" | null>(
    null
  );
  const [message, setMessage] = useState<string | null>(null);
  const requestInFlightRef = useRef(false);

  const isBusy = Boolean(activeAction);
  const baseUrl = `/api/reports/lifenergy-v1/${encodeURIComponent(responseId)}`;

  function releaseButton(nextMessage: string | null) {
    requestInFlightRef.current = false;

    /*
     * O download nativo via anchor.click() não muda de rota e pode não provocar
     * nova renderização imediata em alguns navegadores. Por isso liberamos o
     * botão e forçamos a atualização do DOM ANTES de iniciar o download.
     */
    flushSync(() => {
      setActiveAction(null);
      setMessage(nextMessage);
    });
  }

  async function handleAction(action: "generate" | "regenerate") {
    if (requestInFlightRef.current) {
      return;
    }

    requestInFlightRef.current = true;
    setActiveAction(action);
    setMessage(null);

    try {
      const url = action === "regenerate" ? `${baseUrl}?regenerate=1` : baseUrl;

      /*
       * Primeiro materializamos completamente o DOCX como Blob.
       * Depois liberamos visualmente o botão.
       * Só então dispararmos o download nativo.
       */
      const report = await fetchReport(url);

      releaseButton("Relatório pronto. Download iniciado.");

      window.setTimeout(() => {
        startBrowserDownload(report);
      }, 0);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao gerar relatório.";
      releaseButton(errorMessage);
    }
  }

  return (
    <div
      className="flex flex-col gap-2"
      data-report-button-version={REPORT_BUTTON_VERSION}
    >
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={isBusy}
          onClick={() => handleAction("generate")}
          className={`rounded-full border border-[#B8860B] px-4 py-2 text-[14px] font-bold text-[#0F2D4A] transition hover:bg-[#B8860B]/10 ${
            isBusy ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          {activeAction === "generate" ? "Gerando relatório..." : "Gerar relatório"}
        </button>

        {allowRegenerate ? (
          <button
            type="button"
            disabled={isBusy}
            onClick={() => handleAction("regenerate")}
            className={`rounded-full border border-slate-300 px-4 py-2 text-[14px] font-bold text-slate-700 transition hover:bg-slate-50 ${
              isBusy ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            {activeAction === "regenerate" ? "Regenerando..." : "Regenerar"}
          </button>
        ) : null}
      </div>

      {message ? (
        <p
          className={`text-xs font-medium ${
            message.toLowerCase().includes("erro")
              ? "text-red-700"
              : "text-slate-600"
          }`}
          aria-live="polite"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
