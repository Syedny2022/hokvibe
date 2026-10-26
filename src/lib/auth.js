import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import { enqueueWelcomeEmail } from "./email/outbox";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })],
  callbacks: {
    async jwt({ token, user }) { if (user?.id) token.id = user.id; return token; },
    async session({ session, token }) { if (session.user) session.user.id = token.id || token.sub; return session; },
  },
  events: {
    async createUser({ user }) {
      if (process.env.EMAIL_OUTBOX_ENABLED !== "true" || !user.email) return;
      try { await enqueueWelcomeEmail(user); }
      catch { console.error("Welcome email could not be queued."); }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};
export default authOptions;
