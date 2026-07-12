"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Hexagon, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

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
  const { theme, setTheme } = useTheme();

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
    <div className="flex flex-col h-full bg-muted/50 text-foreground border-r border-border">
      <div className="px-6 py-8 flex-1">
        <Link href="/" className="flex items-center gap-3 mb-10">
          <div className="bg-yellow-500 p-1.5 rounded-md">
            <Hexagon className="h-5 w-5 text-black fill-current" />
          </div>
          <h1 className="text-xl font-bold tracking-wide text-foreground">
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
                  ? "bg-muted text-foreground" 
                  : "hover:bg-muted/50 hover:text-foreground text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="px-6 py-6 border-t border-border space-y-2">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-sm flex py-2 px-3 w-full justify-start font-medium cursor-pointer hover:bg-muted/50 hover:text-foreground rounded-md transition-colors text-muted-foreground"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 mr-3" /> : <Moon className="h-4 w-4 mr-3" />}
          Toggle Theme
        </button>
        <button
          onClick={handleLogout}
          className="text-sm flex py-2 px-3 w-full justify-start font-medium cursor-pointer hover:bg-muted/50 hover:text-foreground rounded-md transition-colors text-muted-foreground"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
