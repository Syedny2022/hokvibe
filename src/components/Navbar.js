"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
export default function Navbar() {
  const { data: session } = useSession();
  return <header className="border-b border-zinc-800"><nav className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4 p-4"><Link href="/" className="text-lg font-bold">Hokvibe</Link><div className="flex flex-wrap items-center gap-4 text-sm"><Link href="/studio">Studio</Link><Link href="/blog">Blog</Link><Link href="/faq">FAQ</Link>{session ? <button type="button" onClick={() => signOut()}>Sign out</button> : <button type="button" onClick={() => signIn("google", { callbackUrl: "/studio" })}>Sign in with Google</button>}</div></nav></header>;
}
