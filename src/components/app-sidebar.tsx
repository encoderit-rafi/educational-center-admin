import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";
import { NavMain } from "./nav-main";
import type { TRoute } from "../types";
import { useRouterState } from "@tanstack/react-router";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Loading from "./base/loading";
import IconLogo from "./base/icon-logo";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BookOpenCheck,
  GraduationCap,
  CalendarCheck,
  TestTube,
  CalendarDays,
  Wrench,
  Calendar,
  Package,
  Notebook,
  UserCheck,
  Video,
  Wallet,
  CalendarClock,
  Phone,
  Ticket,
  FileText,
  Briefcase,
} from "lucide-react";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const {
    location: { pathname },
  } = useRouterState();

  const { open } = useSidebar();
  const { data: user, isLoading } = useCurrentUser();

  const isActiveLink = React.useCallback(
    (items: string[]) =>
      items.some((item) =>
        item === "/" ? pathname === "/" : pathname.startsWith(item)
      ),
    [pathname]
  );

  if (isLoading || !user) {
    return <Loading />;
  }

  const routes: TRoute[] = [
    {
      name: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: isActiveLink(["/"]),
    },
    {
      name: "Users",
      url: "/users",
      icon: Users,
      isActive: isActiveLink(["/users"]),
    },
    {
      name: "Courses",
      url: "/courses",
      icon: BookOpen,
      isActive: isActiveLink(["/courses", "/course-bookings"]),
      children: [
        {
          name: "Courses",
          url: "/courses",
          icon: BookOpen,
          isActive: isActiveLink(["/courses"]),
        },
        {
          name: "Course Bookings",
          url: "/course-bookings",
          icon: CalendarCheck,
          isActive: isActiveLink(["/course-bookings"]),
        },
      ],
    },
    {
      name: "Sub Courses",
      url: "/sub-courses",
      icon: BookOpenCheck,
      isActive: isActiveLink(["/sub-courses"]),
    },
    {
      name: "Exams",
      url: "/exams",
      icon: GraduationCap,
      isActive: isActiveLink(["/exams"]),
      children: [
        {
          name: "Exams",
          url: "/exams",
          icon: GraduationCap,
          isActive: isActiveLink(["/exams"]),
        },
        {
          name: "Exam Bookings",
          url: "/exam-bookings",
          icon: CalendarCheck,
          isActive: isActiveLink(["/exam-bookings"]),
        },
      ],
    },
    {
      name: "Mock Tests",
      url: "/mock-tests",
      icon: TestTube,
      isActive: isActiveLink(["/mock-tests"]),
      children: [
        {
          name: "Mock Tests",
          url: "/mock-tests",
          icon: TestTube,
          isActive: isActiveLink(["/mock-tests"]),
        },
        {
          name: "Mock Test Bookings",
          url: "/mock-test-bookings",
          icon: CalendarCheck,
          isActive: isActiveLink(["/mock-test-bookings"]),
        },
      ],
    },
    {
      name: "Workshops",
      url: "/workshop",
      icon: Wrench,
      isActive: isActiveLink(["/workshop"]),
    },
    {
      name: "Events",
      url: "/events",
      icon: CalendarDays,
      isActive: isActiveLink(["/events"]),
    },
    {
      name: "Consultations",
      url: "/consultations",
      icon: Calendar,
      isActive: isActiveLink(["/consultations"]),
    },
    {
      name: "Packages",
      url: "/course-packages",
      icon: Package,
      isActive: isActiveLink(["/course-packages"]),
    },
    {
      name: "Routines",
      url: "/routines",
      icon: Notebook,
      isActive: isActiveLink(["/routines"]),
    },
    {
      name: "English Test",
      url: "/english-test",
      icon: UserCheck,
      isActive: isActiveLink(["/english-test"]),
    },
    {
      name: "English Quiz",
      url: "/english-quiz",
      icon: FileText,
      isActive: isActiveLink(["/english-quiz"]),
    },
    {
      name: "YouTube Videos",
      url: "/videos",
      icon: Video,
      isActive: isActiveLink(["/videos"]),
    },
    {
      name: "Payments",
      url: "/payments",
      icon: Wallet,
      isActive: isActiveLink(["/payments"]),
    },
    {
      name: "Coupons",
      url: "/coupons",
      icon: Ticket,
      isActive: isActiveLink(["/coupons"]),
    },
    {
      name: "Holidays",
      url: "/holidays",
      icon: CalendarClock,
      isActive: isActiveLink(["/holidays"]),
    },
    {
      name: "Careers",
      url: "/career",
      icon: Briefcase,
      isActive: isActiveLink(["/career"]),
    },
    {
      name: "Contacts",
      url: "/contacts",
      icon: Phone,
      isActive: isActiveLink(["/contacts"]),
    },
    {
      name: "ZOHO Book",
      url: "/zoho",
      icon: BookOpenCheck,
      isActive: isActiveLink(["/zoho"]),
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex justify-between items-center px-2 py-3">
          {open ? (
            <IconLogo />
          ) : (
            <IconLogo withWordmark={false} className="mx-auto" />
          )}
          {open && (
            <SidebarTrigger className="rounded-md text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent" />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain routes={routes} />
      </SidebarContent>

      <SidebarRail />

      {open && (
        <SidebarFooter>
          <p className="text-[12px] text-sidebar-foreground/70 px-2 pb-3">
            © <span className="font-semibold">Admin Panel</span>. All rights reserved.
          </p>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
