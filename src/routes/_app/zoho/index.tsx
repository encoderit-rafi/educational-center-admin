import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
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
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useZohoStatus, useZohoAuthUrl, useZohoDisconnect } from "./-api";
import {
  CloudLightning,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";


export const Route = createFileRoute("/_app/zoho/")({
  component: ZohoConnectionPage,
});

function ZohoConnectionPage() {
  const { data: statusRes, isLoading, isError, refetch } = useZohoStatus();
  const authUrlMutation = useZohoAuthUrl();
  const disconnectMutation = useZohoDisconnect();

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

        <PageBody className="flex justify-center items-start pt-6">
          <Card className="bg-black/30 border-white/5 backdrop-blur-sm w-full max-w-md mx-auto">
            <CardHeader className="text-center py-10">
              <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
              <CardDescription className="text-white/60">
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
              <CloudLightning className="h-6 w-6 text-red-500" />
              Zoho CRM Connection
            </PageTitle>
          </div>
        </PageHeader>

        <PageBody className="flex justify-center items-start pt-6">
          <Card className="bg-black/30 border-white/5 backdrop-blur-sm w-full max-w-md mx-auto">
            <CardHeader className="text-center py-6">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-lg font-semibold text-white/90">
                Failed to load status
              </CardTitle>
              <CardDescription className="text-white/40 text-xs">
                Could not retrieve the current Zoho CRM connection state.
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              <Button
                onClick={() => refetch()}
                className="w-full bg-primary hover:bg-primary/95 text-white font-medium gap-2 justify-center"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Status Check
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
  } = statusData || {};

  const isPending = authUrlMutation.isPending || disconnectMutation.isPending;

  return (
    <PageContainer>
      <PageHeader>
        <div className="flex items-center justify-between gap-1 w-full">
          <PageTitle className="flex items-center gap-2">
            <CloudLightning className="h-6 w-6 text-yellow-500" />
            Zoho CRM Connection
          </PageTitle>
          {connected ? (
            <Button
              onClick={handleDisconnect}
              disabled={isPending}
              className="max-w-44 capitalize bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-medium gap-2 justify-center transition-all duration-200"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                "disconnect"
              )}
            </Button>
          ) : (
            <Button
              onClick={handleConnect}
              disabled={isPending}
              className="max-w-44 capitalize bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-medium gap-2 justify-center transition-all duration-200"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "connect"
              )}
            </Button>
          )}
        </div>
      </PageHeader>

      {/* <PageBody className="flex justify-center items-start pt-6">
        <Card className="bg-black/30 border-white/5 backdrop-blur-sm w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-white/90">
              <Link2 className="h-5 w-5 text-primary" />
              Zoho Connection Manager
            </CardTitle>
            <CardDescription className="text-white/40 text-xs">
              Manage connection status and API synchronization configurations for Zoho integration.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-sm text-white/60">Connection Status</span>
              {connected ? (
                <Badge variant="complete" className="bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="incomplete" className="bg-red-500/20 text-red-400 border-red-500/30">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Disconnected
                </Badge>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                Configuration Details
              </h4>

              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">OAuth Configured</span>
                {oauthConfigured ? (
                  <span className="text-green-400 flex items-center gap-1.5 text-xs">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    Configured
                  </span>
                ) : (
                  <span className="text-white/40 flex items-center gap-1.5 text-xs">
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                    Not Configured
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Books Configured</span>
                {booksConfigured ? (
                  <span className="text-green-400 flex items-center gap-1.5 text-xs">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    Configured
                  </span>
                ) : (
                  <span className="text-white/40 flex items-center gap-1.5 text-xs">
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                    Not Configured
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Encryption Configured</span>
                {encryptionConfigured ? (
                  <span className="text-green-400 flex items-center gap-1.5 text-xs">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    Configured
                  </span>
                ) : (
                  <span className="text-white/40 flex items-center gap-1.5 text-xs">
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                    Not Configured
                  </span>
                )}
              </div>
            </div>

            {redirectUri && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1">
                  OAuth Redirect Callback URI
                </span>
                <div className="bg-black/40 border border-white/5 rounded p-2.5 font-mono text-[10px] text-white/70 break-all select-all">
                  {redirectUri}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-2">
            {connected ? (
              <Button
                onClick={handleDisconnect}
                disabled={isPending}
                className="w-full bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-medium gap-2 justify-center transition-all duration-200"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Disconnecting...
                  </>
                ) : (
                  "disconnect"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isPending}
                className="w-full bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-medium gap-2 justify-center transition-all duration-200"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "connect"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </PageBody> */}
    </PageContainer>
  );
}
