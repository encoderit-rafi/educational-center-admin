import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState } from "react";
import {
  PageContainer,
  PageHeader,
  PageTitle,
  PageBody,
} from "@/components/blocks/app-page";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useZohoStatus, useZohoAuthUrl, useZohoDisconnect } from "./-api";
import {
  CloudLightning,
  Loader2,
  AlertCircle,
  RefreshCw,
  Server,
  Link2,
  Unlink,
  CheckCircle,
  Copy,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/_app/zoho/")({
  component: ZohoConnectionPage,
});

function ZohoConnectionPage() {
  const { data: statusRes, isLoading, isError, refetch } = useZohoStatus();
  const authUrlMutation = useZohoAuthUrl();
  const disconnectMutation = useZohoDisconnect();
  const [copied, setCopied] = useState(false);

  const handleConnect = () => {
    authUrlMutation.mutate(undefined, {
      onSuccess: (res) => {
        const targetUrl =
          typeof res?.data === "string"
            ? res.data
            : res?.data?.authUrl || res?.data?.url || res?.authUrl || res?.url;
        if (targetUrl) {
          toast.success("Redirecting to Zoho for authorization...");
          window.location.href = targetUrl;
        } else {
          toast.error("Authorization URL not found in the response.");
        }
      },
      onError: (error) => {
        const errMsg =
          error instanceof Error
            ? error.message
            : "Failed to get Zoho authorization URL.";
        toast.error(errMsg);
      },
    });
  };

  const handleDisconnect = () => {
    disconnectMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Successfully disconnected from Zoho CRM!");
        refetch();
      },
      onError: (error) => {
        const errMsg =
          error instanceof Error
            ? error.message
            : "Failed to disconnect Zoho CRM.";
        toast.error(errMsg);
      },
    });
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Redirect URI copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader>
          <div className="flex flex-col gap-1">
            <PageTitle className="flex items-center gap-2">
              <CloudLightning className="h-6 w-6 text-yellow-500 animate-pulse" />
              Zoho CRM Connection
            </PageTitle>
          </div>
        </PageHeader>

        <PageBody className="flex justify-center items-center pt-20">
          <Card className="bg-card/40 border-border/85 backdrop-blur-md w-full max-w-md mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 to-primary" />
            <CardHeader className="text-center py-12">
              <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
              <CardTitle className="text-lg font-semibold text-foreground/90">
                Retrieving Status
              </CardTitle>
              <CardDescription className="text-muted-foreground/80 text-sm mt-1">
                Checking Zoho connection status...
              </CardDescription>
            </CardHeader>
          </Card>
        </PageBody>
      </PageContainer>
    );
  }

  if (isError || !statusRes) {
    return (
      <PageContainer>
        <PageHeader>
          <div className="flex flex-col gap-1">
            <PageTitle className="flex items-center gap-2">
              <CloudLightning className="h-6 w-6 text-destructive" />
              Zoho CRM Connection
            </PageTitle>
          </div>
        </PageHeader>

        <PageBody className="flex justify-center items-center pt-20">
          <Card className="bg-card/40 border-destructive/20 backdrop-blur-md w-full max-w-md mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-destructive" />
            <CardHeader className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <CardTitle className="text-xl font-semibold text-foreground/90">
                Failed to Retrieve Status
              </CardTitle>
              <CardDescription className="text-muted-foreground/80 text-sm mt-2">
                Could not retrieve the current Zoho CRM connection state. Please try again.
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2 pb-6">
              <Button
                onClick={() => refetch()}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-medium gap-2 justify-center transition-all duration-200"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Connection Check
              </Button>
            </CardFooter>
          </Card>
        </PageBody>
      </PageContainer>
    );
  }

  // Support both nested data wrapper and direct data payload structures defensively.
  const statusData =
    statusRes?.data &&
    typeof statusRes.data === "object" &&
    "connected" in statusRes.data
      ? statusRes.data
      : (statusRes as any);

  const {
    connected = false,
    oauthConfigured = false,
    booksConfigured = false,
    encryptionConfigured = false,
    redirectUri = "",
  } = statusData || {};

  const isPending = authUrlMutation.isPending || disconnectMutation.isPending;

  return (
    <PageContainer>
      <PageHeader className="mb-6">
        <div className="flex flex-col gap-1">
          <PageTitle className="flex items-center gap-2.5 text-2xl font-bold tracking-tight">
            <CloudLightning className="h-7 w-7 text-[#F6A519] drop-shadow-[0_2px_8px_rgba(246,165,25,0.2)]" />
            Zoho CRM Connection
          </PageTitle>
          <p className="text-sm text-muted-foreground">
            Manage your CRM synchronization settings and verify authorization status.
          </p>
        </div>
      </PageHeader>

      <PageBody>
        <style>{`
          @keyframes progress-flow {
            0% { background-position: 100% 0; }
            100% { background-position: -100% 0; }
          }
          .animate-flow {
            background: linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%);
            background-size: 200% 100%;
            animation: progress-flow 2s linear infinite;
          }
        `}</style>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl w-full mx-auto">
          {/* Main Connection Status Card */}
          <Card className="lg:col-span-2 bg-card/40 border-border/80 backdrop-blur-md shadow-xl flex flex-col justify-between overflow-hidden relative">
            <div className={`absolute top-0 left-0 right-0 h-1 transition-all duration-500 ${connected ? 'bg-green-500' : 'bg-yellow-500'}`} />
            
            <div>
              {/* Header */}
              <div className="p-6 border-b border-border/40">
                <CardTitle className="text-lg font-semibold text-foreground/90">
                  Connection Manager
                </CardTitle>
                <CardDescription className="text-muted-foreground/80 mt-1">
                  Verifying real-time sync mapping pipeline between Educational Center and Zoho.
                </CardDescription>
              </div>

              {/* Visual Flow Animation */}
              <div className="flex items-center justify-center py-14 px-4 bg-muted/20 border-b border-border/40 relative overflow-hidden">
                <div className={`absolute inset-0 bg-radial-gradient opacity-10 blur-3xl pointer-events-none transition-all duration-500 ${connected ? 'from-green-500' : 'from-yellow-500/50'}`} />

                <div className="flex items-center gap-8 md:gap-16 z-10 w-full max-w-md justify-between">
                  {/* Platform Node */}
                  <div className="flex flex-col items-center gap-2.5">
                    <div className="h-16 w-16 rounded-2xl bg-card border border-border/80 flex items-center justify-center shadow-lg relative group transition-all duration-300 hover:scale-105 hover:border-primary/40">
                      <Server className="h-7 w-7 text-primary" />
                      <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-card"></span>
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Local DB</span>
                  </div>

                  {/* Flow Path */}
                  <div className="flex-1 flex flex-col items-center justify-center relative min-w-[60px]">
                    {connected ? (
                      <>
                        <div className="h-[2px] w-full bg-green-500/20 relative rounded-full overflow-hidden">
                          <div className="absolute inset-0 animate-flow" />
                        </div>
                        <div className="absolute -top-3.5 p-1.5 rounded-full bg-green-500/10 border border-green-500/20 shadow-sm shadow-green-500/10">
                          <Link2 className="h-4 w-4 text-green-500 animate-pulse" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-[2px] w-full border-t-2 border-dashed border-muted-foreground/30 relative" />
                        <div className="absolute -top-3.5 p-1.5 rounded-full bg-muted border border-border">
                          <Unlink className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Zoho Node */}
                  <div className="flex flex-col items-center gap-2.5">
                    <div className="h-16 w-16 rounded-2xl bg-card border border-border/80 flex items-center justify-center shadow-lg relative group transition-all duration-300 hover:scale-105 hover:border-[#E21A22]/40">
                      <div className="grid grid-cols-2 gap-1 w-6 h-6">
                        <div className="bg-[#E21A22] rounded-[2px]" />
                        <div className="bg-[#0093D0] rounded-[2px]" />
                        <div className="bg-[#89C240] rounded-[2px]" />
                        <div className="bg-[#F6A519] rounded-[2px]" />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Zoho CRM</span>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className="p-6">
                {connected ? (
                  <div className="rounded-xl bg-green-500/5 border border-green-500/10 p-4 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-foreground/90">Integration Active</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Educational Center admin dashboard is fully authorized and authenticated with Zoho CRM. 
                        Data sync pipelines are listening and automated push queues are active.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/10 p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-foreground/90">Integration Pending</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Automatic synchronization is paused. Connect your Zoho CRM account to enable real-time 
                        updates for courses, bookings, and customer profiles.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-border/40 bg-muted/10 flex justify-end">
              {connected ? (
                <Button
                  onClick={handleDisconnect}
                  disabled={isPending}
                  variant="destructive"
                  className="min-w-44 transition-all duration-200 shadow-md shadow-destructive/10"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Disconnecting...
                    </>
                  ) : (
                    <>
                      <Unlink className="h-4 w-4 mr-2" />
                      Disconnect Zoho CRM
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleConnect}
                  disabled={isPending}
                  className="min-w-44 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white transition-all duration-200 shadow-md shadow-green-600/10"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Link2 className="h-4 w-4 mr-2" />
                      Connect Zoho CRM
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>

          {/* Right Column sidebar info */}
          <div className="flex flex-col gap-6">
            {/* Specs / Configuration Details */}
            <Card className="bg-card/40 border-border/80 backdrop-blur-md shadow-xl overflow-hidden">
              <div className="p-5 border-b border-border/40">
                <CardTitle className="text-base font-semibold text-foreground/90">
                  Integration Specs
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Current integration capabilities state.
                </CardDescription>
              </div>
              <CardContent className="p-5 space-y-4">
                {/* OAuth Status */}
                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground/90">OAuth Integration</span>
                    <span className="text-[11px] text-muted-foreground">User consent mapping status</span>
                  </div>
                  <Badge variant={oauthConfigured ? "complete" : "incomplete"} className="text-[10px]">
                    {oauthConfigured ? "Configured" : "Pending"}
                  </Badge>
                </div>

                {/* Zoho Books Status */}
                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground/90">Zoho Books API</span>
                    <span className="text-[11px] text-muted-foreground">Invoicing engine interface</span>
                  </div>
                  <Badge variant={booksConfigured ? "complete" : "incomplete"} className="text-[10px]">
                    {booksConfigured ? "Configured" : "Pending"}
                  </Badge>
                </div>

                {/* Encryption Status */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground/90">Payload Encryption</span>
                    <span className="text-[11px] text-muted-foreground">Secure end-to-end handshake</span>
                  </div>
                  <Badge variant={encryptionConfigured ? "complete" : "incomplete"} className="text-[10px]">
                    {encryptionConfigured ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* OAuth Redirect URI Card */}
            <Card className="bg-card/40 border-border/80 backdrop-blur-md shadow-xl overflow-hidden">
              <div className="p-5 border-b border-border/40">
                <CardTitle className="text-base font-semibold text-foreground/90">
                  OAuth Redirect Callback URI
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Register this URL as the Authorized Redirect URI inside your Zoho Developer Console.
                </CardDescription>
              </div>
              <CardContent className="p-5">
                <div className="relative group">
                  <div className="w-full bg-muted/50 border border-border/60 rounded-xl p-3 pr-12 font-mono text-[11px] text-muted-foreground break-all select-all leading-relaxed min-h-[50px] flex items-center">
                    {redirectUri || "No redirect URI defined"}
                  </div>
                  {redirectUri && (
                    <Button
                      onClick={() => handleCopy(redirectUri)}
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted opacity-80 hover:opacity-100 transition-opacity"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageBody>
    </PageContainer>
  );
}
