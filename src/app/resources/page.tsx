import { CrisisBanner } from "@/components/CrisisBanner";
import { CRISIS_RESOURCES } from "@/lib/crisis";
import { ArrowLeft, ExternalLink, Heart, Phone } from "lucide-react";
import Link from "next/link";

export default function ResourcesPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen bg-gradient-to-b from-violet-50/50 to-white">
      <header className="border-b border-violet-100/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-2xl items-center gap-4 px-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-violet-500 hover:text-violet-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 fill-violet-500 text-violet-500" />
            <span className="font-semibold text-violet-950">Crisis Resources</span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-violet-950">
            You deserve support right now
          </h1>
          <p className="text-violet-700/80 leading-relaxed">
            If you or someone you know is in crisis, please reach out to a
            trained professional. These services are free, confidential, and
            available 24/7.
          </p>
        </div>

        <a
          href="tel:988"
          className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 p-6 text-white shadow-lg shadow-rose-200 hover:shadow-xl transition-shadow"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold">Call or text 988</p>
            <p className="text-sm text-rose-100">
              Suicide & Crisis Lifeline — available 24/7
            </p>
          </div>
        </a>

        <div className="space-y-3">
          {CRISIS_RESOURCES.map((resource) => (
            <a
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 rounded-2xl bg-white border border-violet-100 p-5 shadow-sm hover:shadow-md hover:shadow-violet-100/50 transition-shadow group"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-violet-950 group-hover:text-violet-700 transition-colors">
                  {resource.name}
                </h3>
                <p className="text-sm text-violet-600/80 mt-1">
                  {resource.description}
                </p>
                <p className="text-sm font-medium text-violet-600 mt-2">
                  {resource.contact}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-violet-300 group-hover:text-violet-500 shrink-0 mt-1 transition-colors" />
            </a>
          ))}
        </div>

        <CrisisBanner />
      </main>
    </div>
  );
}
