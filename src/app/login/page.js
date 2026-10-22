"use client";
import { signIn } from "next-auth/react";
export default function Login() {
  return <main className="mx-auto w-full max-w-md p-8"><h1 className="text-2xl font-semibold">Sign in to Hokvibe</h1><button onClick={() => signIn("google", { callbackUrl: "/studio" })} className="mt-6 rounded border border-zinc-600 px-4 py-3">Continue with Google</button></main>;
}
