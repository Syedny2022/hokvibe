import { processEmailOutbox } from "@/lib/email/outbox";

export async function POST(request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  if (!secret || authorization !== `Bearer ${secret}`) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const result = await processEmailOutbox();
  return Response.json(result);
}
