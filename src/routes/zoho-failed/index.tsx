import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, RefreshCw, Server, XOctagon } from "lucide-react";

export const Route = createFileRoute("/zoho-failed/")({
  component: ZohoFailedPage,
});

function ZohoFailedPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#0A0A0A] px-4">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(239,68,68,0.08)_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-md w-full">
        {/* Animated Connector Visual */}
        <div className="flex items-center gap-6 justify-center w-full mb-2">
          <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
            <Server className="h-6 w-6 text-white/50" />
          </div>
          <div className="flex-1 h-[2px] border-t-2 border-dashed border-red-500/30 relative">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 p-1 rounded-full bg-red-500/20 border border-red-500/30">
              <XOctagon className="h-4.5 w-4.5 text-red-400" />
            </div>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg opacity-60">
            <div className="grid grid-cols-2 gap-1 w-5 h-5">
              <div className="bg-white/20 rounded-[1px]" />
              <div className="bg-white/20 rounded-[1px]" />
              <div className="bg-white/20 rounded-[1px]" />
              <div className="bg-white/20 rounded-[1px]" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-red-400">
            Authorization Failed
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Connection Unsuccessful
          </h1>

          <p className="text-sm text-white/50 leading-relaxed max-w-sm mx-auto">
            The authorization attempt with Zoho CRM failed. This typically
            happens if the user denies request permissions or if the callback
            session expires.
          </p>
        </div>

        <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-3 text-left">
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
          <span className="text-xs text-white/60 leading-relaxed">
            Please make sure that the Zoho CRM application client redirect
            parameters are configured correctly in the Zoho console.
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            to="/zoho"
            className="flex-1 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white/5 px-6 text-sm font-semibold text-white/80 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-white hover:ring-white/20 active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 z-10 flex items-center gap-2 text-xs text-white/20">
        <span>Educational Center</span>
        <div className="size-1 rounded-full bg-white/20" />
        <span>Integration Hub</span>
      </div>
    </div>
  );
}
