"use client";

import { isBackendReady } from "@/lib/store";
import { Database } from "lucide-react";

export function SetupBanner() {
  if (isBackendReady()) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-amber-100 p-2">
          <Database className="h-5 w-5 text-amber-700" />
        </div>
        <div className="space-y-2 text-sm leading-relaxed">
          <p className="font-semibold">Supabase backend not configured yet</p>
          <p>
            Create a free Supabase project, run <code className="rounded bg-amber-100 px-1">supabase/schema.sql</code>,
            enable Anonymous Auth, then add your keys to <code className="rounded bg-amber-100 px-1">.env.local</code>.
            See the README for step-by-step setup.
          </p>
        </div>
      </div>
    </div>
  );
}
