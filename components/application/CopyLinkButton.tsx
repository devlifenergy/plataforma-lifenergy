"use client";

import { useState } from "react";

type CopyLinkButtonProps = {
  path: string;
};

export function CopyLinkButton({ path }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const fullLink = `${window.location.origin}${path}`;

    try {
      await navigator.clipboard.writeText(fullLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      window.prompt("Copie o link abaixo:", fullLink);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="font-semibold text-[#0F2D4A] underline"
    >
      {copied ? "Link copiado" : "Copiar link"}
    </button>
  );
}
