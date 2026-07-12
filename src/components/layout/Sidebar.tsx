"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Hexagon, LogOut } from "lucide-react";

const routes = [
  { label: "Dashboard", href: "/" },
  { label: "Fleet", href: "/vehicles" }, // Mapping Vehicles to Fleet as per mockup
  { label: "Drivers", href: "/drivers" },
  { label: "Trips", href: "/trips" },
  { label: "Maintenance", href: "/maintenance" },
  { label: "Fuel & Expenses", href: "/expenses" },
  { label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      localStorage.removeItem("test_user_loggedIn");
      window.location.href = "/login";
    } catch (e) {
      console.error(e);
      window.location.href = "/login";
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] text-slate-700 border-r border-slate-200">
      <div className="px-6 py-8 flex-1">
        <Link href="/" className="flex items-center gap-3 mb-10">
          <div className="bg-yellow-500 p-1.5 rounded-md">
            <Hexagon className="h-5 w-5 text-black fill-current" />
          </div>
          <h1 className="text-xl font-bold tracking-wide text-slate-900">
            TransitOps
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm flex py-2 px-3 w-full justify-start font-medium cursor-pointer rounded-md transition-colors",
                pathname === route.href || (pathname.startsWith(route.href) && route.href !== "/") 
                  ? "bg-slate-200 text-slate-900" 
                  : "hover:bg-slate-100 hover:text-slate-900 text-slate-500"
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="px-6 py-6 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="text-sm flex py-2 px-3 w-full justify-start font-medium cursor-pointer hover:bg-slate-200 hover:text-slate-900 rounded-md transition-colors text-slate-500"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
