import "server-only";

export async function sendWelcomeEmail(user) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Welcome email skipped: RESEND_API_KEY is not configured.");
    return;
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `welcome/${user.id}` },
    body: JSON.stringify({ from: "Hokvibe <support@mail.hokvibe.com>", to: [user.email], subject: "Welcome to Hokvibe", text: "Welcome to Hokvibe. Start creating your first social draft at https://hokvibe.com/studio." }),
  });
  if (!response.ok) throw new Error(`Resend returned HTTP ${response.status}`);
}
