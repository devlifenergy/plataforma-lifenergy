"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";

type PdiType = "relational" | "corporate";

type GeneratePdiButtonProps = {
  responseId: string;
  pdiType?: PdiType;
  allowRegenerate?: boolean;
  disabledReason?: string | null;
  label?: string;
  regenerateLabel?: string;
};

type PdiDownload = {
  blob: Blob;
  fileName: string;
};

const PDI_BUTTON_VERSION = "1.5.7";

function getFileNameFromContentDisposition(contentDisposition: string | null) {
  if (!contentDisposition) return "PDI_Lifenergy.docx";

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1].trim());
    } catch {
      return utf8Match[1].trim();
    }
  }

  const fallbackMatch = contentDisposition.match(/filename="([^"]+)"/i);
  if (fallbackMatch?.[1]) return fallbackMatch[1].trim();

  return "PDI_Lifenergy.docx";
}

async function fetchPdi(url: string): Promise<PdiDownload> {
  const response = await fetch(url, { method: "GET", cache: "no-store" });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.error || "Erro ao gerar PDI.");
    }

    const text = await response.text().catch(() => "");
    throw new Error(text || "Erro ao gerar PDI.");
  }

  const blob = await response.blob();
  if (!blob.size) throw new Error("O PDI foi gerado sem conteúdo para download.");

  return {
    blob,
    fileName: getFileNameFromContentDisposition(response.headers.get("content-disposition")),
  };
}

function startBrowserDownload(pdi: PdiDownload) {
  const objectUrl = window.URL.createObjectURL(pdi.blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = pdi.fileName;
  anchor.rel = "noopener";
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
}

export function GeneratePdiButton({
  responseId,
  pdiType = "relational",
  allowRegenerate = false,
  disabledReason = null,
  label,
  regenerateLabel,
}: GeneratePdiButtonProps) {
  const [activeAction, setActiveAction] = useState<"generate" | "regenerate" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const requestInFlightRef = useRef(false);

  const isBusy = Boolean(activeAction);
  const isBlocked = Boolean(disabledReason);
  const buttonLabel = label ?? (pdiType === "corporate" ? "Gerar PDI Corporativo" : "Gerar PDI Relacional");
  const regenerateButtonLabel =
    regenerateLabel ?? (pdiType === "corporate" ? "Gerar um novo PDI Corporativo" : "Regenerar PDI");
  const baseUrl = `/api/pdi/lifenergy/${encodeURIComponent(responseId)}?type=${pdiType}`;

  function releaseButton(nextMessage: string | null) {
    requestInFlightRef.current = false;
    flushSync(() => {
      setActiveAction(null);
      setMessage(nextMessage);
    });
  }

  async function handleAction(action: "generate" | "regenerate") {
    if (requestInFlightRef.current || isBlocked) return;

    requestInFlightRef.current = true;
    setActiveAction(action);
    setMessage(null);

    try {
      const url = action === "regenerate" ? `${baseUrl}&regenerate=1` : baseUrl;
      const pdi = await fetchPdi(url);
      releaseButton("PDI pronto. Download iniciado.");
      window.setTimeout(() => startBrowserDownload(pdi), 0);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao gerar PDI.";
      releaseButton(errorMessage);
    }
  }

  return (
    <div
      className="flex h-full w-full min-w-[230px] flex-col gap-2"
      data-pdi-button-version={PDI_BUTTON_VERSION}
      data-pdi-type={pdiType}
    >
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={isBusy || isBlocked}
          onClick={() => handleAction("generate")}
          className={`w-full whitespace-nowrap rounded-full border px-4 py-2 text-center text-[14px] font-bold transition ${
            pdiType === "corporate"
              ? "border-[#B8860B] text-[#0F2D4A] hover:bg-[#B8860B]/10"
              : "border-[#0F2D4A] text-[#0F2D4A] hover:bg-[#0F2D4A]/10"
          } ${isBusy || isBlocked ? "cursor-not-allowed opacity-60" : ""}`}
        >
          {activeAction === "generate" ? "Gerando PDI..." : buttonLabel}
        </button>

        {allowRegenerate ? (
          <button
            type="button"
            disabled={isBusy || isBlocked}
            onClick={() => handleAction("regenerate")}
            className={`w-full whitespace-nowrap rounded-full border border-slate-300 px-4 py-2 text-center text-[14px] font-bold text-slate-700 transition hover:bg-slate-50 ${
              isBusy || isBlocked ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            {activeAction === "regenerate" ? "Regenerando PDI..." : regenerateButtonLabel}
          </button>
        ) : null}
      </div>

      {isBlocked ? (
        <p className="max-w-xl text-xs font-medium leading-5 text-amber-700" aria-live="polite">
          {disabledReason}
        </p>
      ) : null}

      {message ? (
        <p
          className={`text-xs font-medium ${
            message.toLowerCase().includes("erro") || message.toLowerCase().includes("bloqueado")
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
