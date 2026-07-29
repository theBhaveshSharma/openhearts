"use client";

import { AlertTriangle, Phone } from "lucide-react";
import Link from "next/link";
import { DISCLAIMER } from "@/lib/crisis";

export function CrisisBanner({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-sm text-rose-800">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span className="flex-1">
          In crisis?{" "}
          <Link href="/resources" className="font-semibold underline underline-offset-2">
            Get help now
          </Link>
        </span>
        <a
          href="tel:988"
          className="flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1 text-xs font-medium text-white hover:bg-rose-700 transition-colors"
        >
          <Phone className="h-3 w-3" />
          988
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200/60 p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-rose-100 p-2">
          <AlertTriangle className="h-5 w-5 text-rose-600" />
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-sm leading-relaxed text-rose-900/80">{DISCLAIMER}</p>
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700 hover:text-rose-900 transition-colors"
          >
            View crisis resources
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
