import { CrisisBanner } from "@/components/CrisisBanner";
import { Heart, MessageCircle, Shield, Users } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Shield,
    title: "Anonymous & safe",
    description:
      "Share freely without revealing your identity. Your privacy is protected.",
  },
  {
    icon: Users,
    title: "Global community",
    description:
      "Connect with people worldwide who understand what you're going through.",
  },
  {
    icon: MessageCircle,
    title: "Peer support",
    description:
      "Receive encouragement, virtual hugs, and kind words from others who care.",
  },
  {
    icon: Heart,
    title: "No judgment",
    description:
      "A space built on empathy. Every feeling is valid, every story matters.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-100/80 via-purple-50/40 to-transparent" />
        <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />
        <div className="absolute top-40 right-1/4 h-56 w-56 rounded-full bg-purple-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-violet-200/60 px-4 py-1.5 text-sm text-violet-700 mb-8 shadow-sm">
            <Heart className="h-4 w-4 fill-violet-500 text-violet-500" />
            Peer support, not therapy
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-violet-950 leading-[1.1] mb-6">
            You don&apos;t have to
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
              face it alone
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-lg text-violet-700/80 leading-relaxed mb-10">
            OpenHearts is a safe space to anonymously share your thoughts,
            feelings, and life struggles — and receive genuine support from
            people around the world who understand.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/feed"
              className="w-full sm:w-auto rounded-2xl bg-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-200 hover:bg-violet-700 hover:shadow-xl hover:shadow-violet-200 transition-all"
            >
              Join the community
            </Link>
            <Link
              href="/resources"
              className="w-full sm:w-auto rounded-2xl border border-violet-200 bg-white/80 px-8 py-3.5 text-base font-medium text-violet-700 hover:bg-violet-50 transition-colors"
            >
              Crisis resources
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid sm:grid-cols-2 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-white border border-violet-100 p-6 shadow-sm hover:shadow-md hover:shadow-violet-100/50 transition-shadow"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 mb-4">
                <feature.icon className="h-5 w-5 text-violet-600" />
              </div>
              <h3 className="text-base font-semibold text-violet-950 mb-1.5">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-violet-600/80">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <CrisisBanner />
      </section>

      {/* Footer */}
      <footer className="border-t border-violet-100 bg-white/50 py-8 text-center text-sm text-violet-400">
        <p>OpenHearts — A peer support community. Not a replacement for therapy or emergency care.</p>
      </footer>
    </div>
  );
}
