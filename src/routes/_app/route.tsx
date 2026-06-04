import { AppSidebar } from '@/components/app-sidebar';
import Navbar from '@/components/navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import Loading from '@/components/base/loading';
import { ShopProvider } from '@/context/ShopContext';

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  const {
    data: user,
    isLoading: isLoadingUser,
    isFetching,
  } = useCurrentUser();

  useEffect(() => {
    // Only redirect if we're not loading AND not fetching AND no user AND haven't redirected yet
    if (!isLoadingUser && !isFetching && !user && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate({
        to: "/login",
        replace: true,
      });
    }
  }, [user, isLoadingUser, isFetching, navigate]);

  // Show loading while initial load or background fetch is happening
  if (isLoadingUser || (isFetching && !user)) {
    return (
      <div className="flex h-svh w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!user) {
    return null; // redirect already triggered
  }

  return (
    <ShopProvider user={user}>
      <SidebarProvider>
        <div className="flex h-svh w-full overflow-hidden">
          <div className="max-w-full">
            <AppSidebar />
          </div>
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Navbar />
            <main className="flex-1 flex flex-col">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ShopProvider>
  );
}
