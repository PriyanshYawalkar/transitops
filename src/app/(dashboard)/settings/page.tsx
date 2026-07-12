"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Check } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* GENERAL SETTINGS */}
        <div className="lg:w-1/3 space-y-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">General</h2>
          <Card className="border border-border shadow-sm bg-card">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Depot Name</label>
                <input type="text" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" defaultValue="Gandhinagar Depot #24" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Currency</label>
                <input type="text" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" defaultValue="INR (₹)" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Distance Unit</label>
                <input type="text" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" defaultValue="Kilometers" />
              </div>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-none">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* RBAC MATRIX */}
        <div className="lg:w-2/3 space-y-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role-Based Access (RBAC)</h2>
          <Card className="border border-border shadow-sm bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-muted-foreground">
                <thead className="text-[10px] uppercase bg-muted/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-semibold tracking-wider">Role</th>
                    <th className="px-6 py-3 font-semibold tracking-wider text-center">Fleet</th>
                    <th className="px-6 py-3 font-semibold tracking-wider text-center">Driver</th>
                    <th className="px-6 py-3 font-semibold tracking-wider text-center">Trip</th>
                    <th className="px-6 py-3 font-semibold tracking-wider text-center">Fuel/Exp</th>
                    <th className="px-6 py-3 font-semibold tracking-wider text-center">Analytics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">Fleet Manager</td>
                    <td className="px-6 py-4 text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                    <td className="px-6 py-4 text-center text-muted-foreground">-</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">-</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">-</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">Dispatcher</td>
                    <td className="px-6 py-4 text-center text-xs text-muted-foreground">View</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">-</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">-</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">-</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">Safety Officer</td>
                    <td className="px-6 py-4 text-center text-slate-300">-</td>
                    <td className="px-6 py-4 text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                    <td className="px-6 py-4 text-center text-xs text-muted-foreground">View</td>
                    <td className="px-6 py-4 text-center text-slate-300">-</td>
                    <td className="px-6 py-4 text-center text-slate-300">-</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">Financial Analyst</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">-</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">-</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">-</td>
                    <td className="px-6 py-4 text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
      </div>
    </div>
  );
}
