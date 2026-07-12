"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Truck,
  Users,
  Map,
  Wrench,
  Receipt,
  LogOut,
  Settings
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Vehicles",
    icon: Truck,
    href: "/vehicles",
    color: "text-violet-500",
  },
  {
    label: "Drivers",
    icon: Users,
    href: "/drivers",
    color: "text-pink-700",
  },
  {
    label: "Trips",
    icon: Map,
    href: "/trips",
    color: "text-orange-700",
  },
  {
    label: "Maintenance",
    icon: Wrench,
    href: "/maintenance",
    color: "text-emerald-500",
  },
  {
    label: "Expenses",
    icon: Receipt,
    href: "/expenses",
    color: "text-gray-500",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-card text-card-foreground border-r glass">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4 bg-primary rounded-lg flex items-center justify-center">
             <Truck className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">
            TransitOps
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition-colors",
                pathname === route.href ? "text-primary bg-primary/10" : "text-muted-foreground"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="px-3 py-2">
        <div className="space-y-1">
          <Link
            href="/settings"
            className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition-colors text-muted-foreground"
          >
            <div className="flex items-center flex-1">
              <Settings className="h-5 w-5 mr-3 text-slate-500" />
              Settings
            </div>
          </Link>
          <button
            className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors text-muted-foreground"
          >
            <div className="flex items-center flex-1">
              <LogOut className="h-5 w-5 mr-3 text-red-500" />
              Logout
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
