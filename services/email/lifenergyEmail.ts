type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendLifenergyEmail(params: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LIFENERGY_EMAIL_FROM;

  if (!apiKey || !from) {
    return { sent: false, reason: "E-mail transacional não configurado no ambiente." } as const;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [params.to], subject: params.subject, html: params.html }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || "Não foi possível enviar o e-mail.");
  }

  return { sent: true } as const;
}

export function getApplicationBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "";

  if (!raw) return "";
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, "");
}
