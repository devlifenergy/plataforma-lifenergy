"use client";

import { useState, useTransition } from "react";
import { sendJourneyLinkEmail } from "@/services/journeys/actions";

export function SendJourneyLinkEmailButton({ journeyId, disabled = false }: { journeyId: string; disabled?: boolean }) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col items-start gap-1 lg:items-end">
      <button
        type="button"
        disabled={disabled || pending}
        onClick={() => startTransition(async () => {
          setMessage(null);
          try {
            await sendJourneyLinkEmail(journeyId);
            setMessage("Link enviado por e-mail.");
            window.setTimeout(() => setMessage(null), 2500);
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Erro ao enviar e-mail.");
          }
        })}
        className="font-semibold text-[#0F2D4A] underline disabled:cursor-not-allowed disabled:text-slate-400"
        title="Envia o link da avaliação para o e-mail cadastrado do avaliado."
      >
        {pending ? "Enviando..." : "Enviar por e-mail"}
      </button>
      {message ? <span className={`max-w-xs text-xs ${message.includes("enviado") ? "text-emerald-700" : "text-red-700"}`}>{message}</span> : null}
    </div>
  );
}
