import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AIService } from "@/lib/services/ai";

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });
    const { id, text } = await req.json();
    if (typeof id !== "string" || typeof text !== "string" || text.length > 50000) return new NextResponse("Invalid draft", { status: 400 });
    const draft = await prisma.socialPostCreation.findFirst({ where: { id, userId: session.user.id, status: "completed" } });
    if (!draft) return new NextResponse("Not found", { status: 404 });
    let result;
    try { result = JSON.parse(draft.resultText); } catch { result = {}; }
    const updated = await prisma.socialPostCreation.updateMany({ where: { id, userId: session.user.id, status: "completed" }, data: { resultText: JSON.stringify({ ...result, postText: text }) } });
    if (!updated.count) return new NextResponse("Not found", { status: 404 });
    return NextResponse.json({ saved: true });
  } catch (error) {
    console.error("[CREATIONS_PATCH_ERROR]", error);
    return new NextResponse("Could not save draft", { status: 500 });
  }
}

// GET — list creations or poll a specific requestId
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get("requestId");

    const customApiKey = null;

    if (requestId) {
      const owned = await prisma.socialPostCreation.findFirst({ where: { requestId, userId: session.user.id }, select: { id: true } });
      if (!owned) return new NextResponse("Not found", { status: 404 });
      const statusData = await AIService.checkStatus(requestId, customApiKey);
      return NextResponse.json(statusData);
    }

    const creations = await prisma.socialPostCreation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { publications: { orderBy: { createdAt: "desc" }, select: { platform: true, status: true, postUrl: true, error: true, createdAt: true } } },
    });

    // Self-healing: sync any still-processing items on the fly
    const updated = await Promise.all(
      creations.map(async (c) => {
        if (c.status === "processing" && c.requestId) {
          try {
            await AIService.checkStatus(c.requestId, customApiKey);
            return (
              (await prisma.socialPostCreation.findUnique({
                where: { id: c.id },
              })) || c
            );
          } catch {
            return c;
          }
        }
        return c;
      })
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[CREATIONS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST — submit a new social post generation
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { topic, platformId, toneId, includeEmojis, includeHashtags, language, charLength, includeTitle } = body;

    if (!topic || topic.trim() === "") {
      return new NextResponse("Missing topic description", { status: 400 });
    }

    const customApiKey = null;

    const creation = await AIService.generateSocialPost(session.user.id, {
      topic,
      platformId,
      toneId,
      includeEmojis: includeEmojis !== false,
      includeHashtags: includeHashtags !== false,
      language: language || "english",
      charLength: charLength || "medium",
      includeTitle: includeTitle !== false,
      customApiKey,
    });

    return NextResponse.json(creation);
  } catch (error) {
    console.error("[CREATIONS_POST_ERROR]", error);
    return new NextResponse("Generation is temporarily unavailable.", { status: 500 });
  }
}
