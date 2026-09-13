"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-divider/40 bg-bg-page py-6 text-center text-xs text-secondary-text mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          &copy; Hokvibe
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/pricing" className="hover:text-primary-text transition-colors">
            Pricing
          </Link>
          <span className="opacity-30">•</span>
          <Link href="/privacy" className="hover:text-primary-text transition-colors">
            Privacy
          </Link>
          <span className="opacity-30">•</span>
          <Link href="/terms" className="hover:text-primary-text transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
