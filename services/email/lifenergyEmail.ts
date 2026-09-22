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
    process.env.LIFENERGY_APP_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "";

  if (!raw) return "";
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, "");
}

function escapeHtml(value: string) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function emailShell(content: string) {
  return `<div style="margin:0;background:#f6f4ef;padding:28px 16px;font-family:Arial,Helvetica,sans-serif;color:#243447"><div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden"><div style="background:#0F2D4A;padding:22px 28px;color:#ffffff"><div style="font-size:22px;font-weight:700">Lifenergy Digital</div></div><div style="padding:28px;line-height:1.65;font-size:15px">${content}</div><div style="padding:18px 28px;border-top:1px solid #e5e7eb;color:#64748b;font-size:12px">Equipe Lifenergy</div></div></div>`;
}

function actionButton(label: string, url: string) {
  const safeUrl = escapeHtml(url);
  return `<p style="margin:24px 0"><a href="${safeUrl}" style="display:inline-block;background:#0F2D4A;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:10px">${escapeHtml(label)}</a></p>`;
}

export function companyAccessEmail(params: { companyName: string; adminName: string; email: string; temporaryPassword: string; loginUrl: string }) {
  const { companyName, adminName, email, temporaryPassword, loginUrl } = params;
  return {
    subject: "Acesso ao Lifenergy Digital",
    html: emailShell(`<p>Olá, <strong>${escapeHtml(adminName)}</strong>.</p><p>A empresa <strong>${escapeHtml(companyName)}</strong> foi criada no Lifenergy Digital e seu acesso já está disponível.</p><p><strong>Link para acesso:</strong> ${escapeHtml(loginUrl)}<br><strong>Usuário:</strong> ${escapeHtml(email)}<br><strong>Senha temporária:</strong> ${escapeHtml(temporaryPassword)}</p>${actionButton("Acessar o Lifenergy Digital", loginUrl)}<p>Por segurança, será solicitada a alteração da senha no primeiro acesso.</p>`),
  };
}

export function journeyInvitationEmail(params: { participantName: string; companyName: string; invitationUrl: string }) {
  const { participantName, companyName, invitationUrl } = params;
  return {
    subject: "Convite para Avaliação de Desenvolvimento Relacional – Lifenergy Digital",
    html: emailShell(`<p>Olá, <strong>${escapeHtml(participantName)}</strong>.</p><p>Você foi convidado(a) por <strong>${escapeHtml(companyName)}</strong> a responder um formulário de <strong>Desenvolvimento Relacional</strong> no Lifenergy Digital.</p><p>A atividade tem como objetivo apoiar o processo de desenvolvimento e ampliar a compreensão sobre padrões de comportamento e relacionamento.</p><p><strong>Orientações:</strong></p><ul><li>Reserve um momento em que possa realizar a atividade com tranquilidade e sem interrupções.</li><li>Leia atentamente as instruções apresentadas no formulário.</li><li>Responda de maneira espontânea, evitando excesso de reflexão sobre as respostas.</li><li>Este link é individual e deve ser utilizado exclusivamente por você.</li></ul>${actionButton("Acessar o formulário", invitationUrl)}<p>Se o botão não abrir, copie este endereço no navegador:<br>${escapeHtml(invitationUrl)}</p>`),
  };
}

export function companyPasswordUpdatedEmail(params: { companyName: string; adminName: string; email: string; temporaryPassword: string; loginUrl: string }) {
  const { companyName, adminName, email, temporaryPassword, loginUrl } = params;
  return {
    subject: "Nova senha de acesso ao Lifenergy Digital",
    html: emailShell(`<p>Olá, <strong>${escapeHtml(adminName)}</strong>.</p><p>A senha de acesso da empresa <strong>${escapeHtml(companyName)}</strong> foi atualizada no Lifenergy Digital.</p><p><strong>Link para acesso:</strong> ${escapeHtml(loginUrl)}<br><strong>Usuário:</strong> ${escapeHtml(email)}<br><strong>Senha temporária:</strong> ${escapeHtml(temporaryPassword)}</p>${actionButton("Acessar o Lifenergy Digital", loginUrl)}<p>Por segurança, será solicitada a alteração da senha no próximo acesso.</p>`),
  };
}

export function licensesAddedEmail(params: { companyName: string; additions: Array<{ label: string; quantity: number }>; loginUrl: string }) {
  const { companyName, additions, loginUrl } = params;
  const total = additions.reduce((sum, item) => sum + item.quantity, 0);
  const rows = additions.filter((item) => item.quantity > 0).map((item) => `<li><strong>${escapeHtml(item.label)}:</strong> ${item.quantity}</li>`).join("");
  return {
    subject: "Novas licenças disponíveis – Lifenergy Digital",
    html: emailShell(`<p>Olá.</p><p>Informamos que <strong>${total} ${total === 1 ? "licença foi adicionada" : "licenças foram adicionadas"}</strong> ao perfil da empresa <strong>${escapeHtml(companyName)}</strong> no Lifenergy Digital.</p><ul>${rows}</ul><p>As novas licenças já estão disponíveis para utilização.</p>${actionButton("Acessar o Lifenergy Digital", loginUrl)}`),
  };
}
