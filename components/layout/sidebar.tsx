"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Award,
  Calendar,
  CheckSquare,
  Building2,
  LogOut,
  Menu,
  X,
  Settings,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "manager", "employee"],
  },
  {
    name: "Employees",
    href: "/employees",
    icon: Users,
    roles: ["admin", "manager", "employee"],
  },
  {
    name: "Projects",
    href: "/products",
    icon: Briefcase,
    roles: ["admin", "manager", "employee"],
  },
  {
    name: "Skills",
    href: "/skills",
    icon: Award,
    roles: ["admin", "manager", "employee"],
  },
  {
    name: "Sprints",
    href: "/sprints",
    icon: Calendar,
    roles: ["admin", "manager", "employee"],
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
    roles: ["admin", "manager", "employee"],
  },
  {
    name: "Clients",
    href: "/clients",
    icon: Building2,
    roles: ["admin", "manager"],
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["admin", "manager", "employee"],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredNavigation = navigation.filter((item) =>
    user ? item.roles.includes(user.role) : true,
  );

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed left-4 top-4 z-50 rounded-md bg-white p-2 shadow-md lg:hidden"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-white transition-transform duration-200 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <h1 className="text-xl font-bold">Project Manager</h1>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {filteredNavigation.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t p-4">
            <div className="mb-3 rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <p className="mt-1 text-xs font-medium capitalize text-primary">
                {user?.role}
              </p>
            </div>
            <Link
              key={navigation[7].name}
              href={navigation[7].href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                true
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm cursor-pointer font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
