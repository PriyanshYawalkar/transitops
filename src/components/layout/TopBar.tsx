"use client";

import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/contexts/AuthContext";

export function TopBar() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const getPageTitle = () => {
    switch(pathname) {
      case '/': return 'Dashboard';
      case '/vehicles': return 'Fleet';
      case '/drivers': return 'Drivers';
      case '/trips': return 'Trip Dispatcher';
      case '/maintenance': return 'Maintenance';
      case '/expenses': return 'Fuel & Expense Management';
      case '/settings': return 'Settings & RBAC';
      default: return 'TransitOps';
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-border bg-background sticky top-0 z-10">
      <div className="flex items-center gap-6">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {getPageTitle()}
        </h2>
      </div>
      
      <div className="flex items-center space-x-4 flex-1 justify-between max-w-3xl ml-8">
        <div className="relative w-full max-w-md hidden md:block">
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-full rounded-md border border-input bg-muted px-4 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-foreground hidden sm:block">
            {user?.email?.split("@")[0] || "Raven K."}
          </span>
          <Badge variant="default" className="bg-blue-100 text-blue-700 hover:bg-blue-100 shadow-none border-0 text-xs py-0.5">
            Dispatcher
          </Badge>
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border">
            <span className="text-xs font-bold text-foreground">
              {(user?.email?.[0] || "R").toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
