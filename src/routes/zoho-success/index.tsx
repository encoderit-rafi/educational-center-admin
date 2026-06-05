import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, Server, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/zoho-success/")({
  component: ZohoSuccessPage,
});

function ZohoSuccessPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#0A0A0A] px-4">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.08)_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-md w-full">
        {/* Animated Connector Visual */}
        <div className="flex items-center gap-6 justify-center w-full mb-2">
          <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
            <Server className="h-6 w-6 text-white/70" />
          </div>
          <div className="flex-1 h-[2px] bg-gradient-to-r from-green-500/20 via-green-500 to-green-500/20 relative">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 p-1 rounded-full bg-green-500/20 border border-green-500/30">
              <ShieldCheck className="h-4.5 w-4.5 text-green-400" />
            </div>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
            <div className="grid grid-cols-2 gap-1 w-5 h-5">
              <div className="bg-[#E21A22] rounded-[1px]" />
              <div className="bg-[#0093D0] rounded-[1px]" />
              <div className="bg-[#89C240] rounded-[1px]" />
              <div className="bg-[#F6A519] rounded-[1px]" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-green-400">
            Authorization Complete
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Zoho CRM Connected!
          </h1>

          <p className="text-sm text-white/50 leading-relaxed max-w-sm mx-auto">
            Your credentials were validated and your Educational Center is now
            fully connected to your Zoho CRM workspace. Data sync pipelines are
            active.
          </p>
        </div>

        <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-3 text-left">
          <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
          <span className="text-xs text-white/60 leading-relaxed">
            OAuth client tokens have been securely updated. You may now safely
            return to your workspace console.
          </span>
        </div>

        <Link
          to="/zoho"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-500 active:bg-green-700 font-semibold text-white transition-all shadow-lg shadow-green-600/10 active:scale-[0.98]"
        >
          Return to Dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="absolute bottom-8 z-10 flex items-center gap-2 text-xs text-white/20">
        <span>Educational Center</span>
        <div className="size-1 rounded-full bg-white/20" />
        <span>Integration Hub</span>
      </div>
    </div>
  );
}
