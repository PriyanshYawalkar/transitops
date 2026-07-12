"use client";

import { Bell, Search, User } from "lucide-react";
import { usePathname } from "next/navigation";

export function TopBar() {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    switch(pathname) {
      case '/': return 'Dashboard';
      case '/vehicles': return 'Vehicle Registry';
      case '/drivers': return 'Driver Management';
      case '/trips': return 'Trip Management';
      case '/maintenance': return 'Maintenance Logs';
      case '/expenses': return 'Fuel & Expenses';
      default: return 'TransitOps';
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b bg-card/50 backdrop-blur-md sticky top-0 z-10 glass">
      <h2 className="text-xl font-semibold tracking-tight">
        {getPageTitle()}
      </h2>
      
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-64 rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        
        <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
        </button>
        
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center cursor-pointer border border-primary/30">
          <User className="h-4 w-4 text-primary" />
        </div>
      </div>
    </header>
  );
}
