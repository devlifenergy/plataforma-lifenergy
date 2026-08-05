"use client";

import { useState } from "react";

type DeletePendingJourneyButtonProps = {
  journeyId: string;
};

export function DeletePendingJourneyButton({
  journeyId,
}: DeletePendingJourneyButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este link? Essa ação não poderá ser desfeita."
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/journeys/${encodeURIComponent(journeyId)}`,
        { method: "DELETE" }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "Não foi possível excluir o link.");
      }

      window.location.reload();
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Não foi possível excluir o link.";
      setError(message);
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1 lg:items-end">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="font-semibold text-red-600 underline transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting ? "Excluindo..." : "Excluir link"}
      </button>
      {error ? <p className="max-w-xs text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
