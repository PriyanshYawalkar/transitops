"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Wrench } from "lucide-react";

const mockLogs = [
  { id: "M001", vehicle: "VAN-05", service: "Oil Change", cost: "2,500", status: "In Shop", date: "05/03/2026" },
  { id: "M002", vehicle: "TRUCK-01", service: "Engine Repair", cost: "15,000", status: "Completed", date: "02/03/2026" },
  { id: "M003", vehicle: "MINI-01", service: "Tyre Replace", cost: "6,200", status: "In Shop", date: "10/03/2026" },
];

export default function MaintenancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-card p-4 rounded-md border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground font-medium">
            <input type="search" placeholder="Search maintenance logs..." className="border border-input rounded text-foreground bg-muted px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-64" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LOG SERVICE RECORD Form */}
        <div className="lg:w-1/3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Log Service Record</h2>
          <Card className="border border-border shadow-sm bg-card">
            <CardContent className="p-6">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vehicle</label>
                  <select className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground">
                    <option>VAN-05</option>
                    <option>TRUCK-01</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Service Type</label>
                  <input type="text" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" placeholder="Oil Change" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cost (₹)</label>
                  <input type="number" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" placeholder="2500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</label>
                  <input type="date" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</label>
                  <select className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground">
                    <option>Active</option>
                    <option>Completed</option>
                  </select>
                </div>
                <Button className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-none">Save</Button>
              </form>
              <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground space-y-2">
                <div className="flex justify-between items-center">
                  <span>Available</span>
                  <span className="text-muted-foreground">---&gt;</span>
                  <span className="text-orange-500 font-bold">In Shop</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-500 font-bold">In Shop</span>
                  <span className="text-muted-foreground">---&gt;</span>
                  <span className="text-green-500 font-bold">Available</span>
                </div>
                <p className="italic mt-4">Note: In Shop vehicles are removed from the dispatch pool.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SERVICE LOG Table */}
        <div className="lg:w-2/3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Service Log</h2>
          <Card className="border border-border shadow-sm bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-muted-foreground">
                <thead className="text-[10px] uppercase bg-muted/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-semibold tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 font-semibold tracking-wider">Service</th>
                    <th className="px-6 py-3 font-semibold tracking-wider">Cost</th>
                    <th className="px-6 py-3 font-semibold tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{log.vehicle}</td>
                      <td className="px-6 py-4">{log.service}</td>
                      <td className="px-6 py-4">{log.cost}</td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          log.status === "Completed" ? "success" : "warning"
                        } className="rounded-sm shadow-none uppercase tracking-wide text-[10px] px-2 py-0.5 font-bold">
                          {log.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
