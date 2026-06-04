import { useState } from "react";
import { Bell, AlertCircle, LogIn, LogOut, CheckCircle2, Loader2, UserCheck, AlertTriangle, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetAllNotifications } from "@/queries/use-get-all-notifications";
import { useMarkNotificationAsRead } from "@/queries/mutations/use-mark-notification-as-read";

const getIconByType = (type: string) => {
  switch (type) {
    case "incident_created":
      return <AlertCircle className="w-4 h-4 text-gray-500" />;
    case "incident_updated":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case "incident_deleted":
      return <Trash2 className="w-4 h-4 text-red-500" />;
    case "check_in":
      return <LogIn className="w-4 h-4 text-green-500" />;
    case "check_out":
      return <LogOut className="w-4 h-4 text-orange-500" />;
    case "officer_approval":
      return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
    case "officer_assigned":
      return <UserCheck className="w-4 h-4 text-indigo-500" />;
    default:
      return <Bell className="w-4 h-4 text-gray-500" />;
  }
};

const getTypeLabel = (type: string): string => {
  const labels: { [key: string]: string } = {
    incident_created: "Incident Created",
    incident_updated: "Incident Updated",
    incident_deleted: "Incident Deleted",
    check_in: "Check In",
    check_out: "Check Out",
    officer_approval: "Approval",
    officer_assigned: "Assignment",
  };
  return labels[type] || "Notification";
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notificationResponse, isLoading, refetch } = useGetAllNotifications({
    params: { page: 1, per_page: 5, search: "" },
    options: { enabled: true },
  });
  const markAsReadMutation = useMarkNotificationAsRead();

  const notifications = notificationResponse?.data?.notifications?.data ?? [];
  const unreadCount = notificationResponse?.data?.unread_count ?? 0;

  const handleRefresh = async () => {
    await refetch();
  };

  const handleNotificationClick = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    if (notification && !notification.read_at) {
      markAsReadMutation.mutate(id);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs rounded-full"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[420px] p-0 rounded-lg" align="end" sideOffset={8}>
        <div className="flex flex-col h-full max-h-[500px] mb-12 overflow-y-auto bg-background">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-1 hover:bg-accent rounded-md transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="text-xs text-muted-foreground">↻</span>
              )}
            </button>
          </div>

          {/* Notifications List */}
          {notifications.length > 0 ? (
            <ScrollArea className="flex-1">
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`p-4 hover:bg-accent/50 cursor-pointer transition-colors border-l-4 ${
                      notification.read_at
                        ? "border-l-transparent opacity-60 cursor-default hover:bg-transparent"
                        : "border-l-red-500"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getIconByType(notification.data.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm leading-tight">
                              {notification.data.message}
                            </p>
                            {notification.data.data?.service?.company_name && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {notification.data.data.service.company_name}
                              </p>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {getTypeLabel(notification.data.type)}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground mt-2">
                          {formatTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground/30 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">
                {isLoading ? "Loading notifications..." : "No notifications yet"}
              </p>
            </div>
          )}

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-1 border-t bg-muted/30 fixed bottom-0 w-full">
              <Button
                variant="ghost"
                className="w-full text-xs justify-center"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                View all notifications
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
