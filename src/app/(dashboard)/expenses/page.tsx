"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

const mockFuelLogs = [
  { id: "F1", vehicle: "VAN-05", date: "06 Jul 2026", liters: "42 L", cost: "3,150" },
  { id: "F2", vehicle: "TRUCK-12", date: "06 Jul 2026", liters: "90 L", cost: "8,100" },
  { id: "F3", vehicle: "MINI-01", date: "04 Jul 2026", liters: "25 L", cost: "2,250" },
];

const mockExpenses = [
  { id: "E1", trip: "TR001", vehicle: "VAN-05", toll: "120", other: "0", status: "Completed" },
  { id: "E2", trip: "TR002", vehicle: "TRK-12", toll: "345", other: "150", status: "Completed" },
];

export default function ExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fuel Logs</h2>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-none h-8 text-xs px-3" onClick={() => setIsModalOpen(true)}>
              + Log Fuel
            </Button>
          </div>
          <Card className="border border-border shadow-sm bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-muted-foreground">
                <thead className="text-[10px] uppercase bg-muted/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-semibold tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 font-semibold tracking-wider">Date</th>
                    <th className="px-6 py-3 font-semibold tracking-wider">Liters</th>
                    <th className="px-6 py-3 font-semibold tracking-wider text-right">Cost (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockFuelLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{log.vehicle}</td>
                      <td className="px-6 py-4">{log.date}</td>
                      <td className="px-6 py-4">{log.liters}</td>
                      <td className="px-6 py-4 text-right">{log.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="lg:w-1/2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Other Expenses (Toll / Misc)</h2>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-none h-8 text-xs px-3">
              + Add Expense
            </Button>
          </div>
          <Card className="border border-border shadow-sm bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-muted-foreground">
                <thead className="text-[10px] uppercase bg-muted/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-semibold tracking-wider">Trip</th>
                    <th className="px-6 py-3 font-semibold tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 font-semibold tracking-wider">Toll (₹)</th>
                    <th className="px-6 py-3 font-semibold tracking-wider">Other (₹)</th>
                    <th className="px-6 py-3 font-semibold tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {mockExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{exp.trip}</td>
                      <td className="px-6 py-4">{exp.vehicle}</td>
                      <td className="px-6 py-4">{exp.toll}</td>
                      <td className="px-6 py-4">{exp.other}</td>
                      <td className="px-6 py-4">
                        <Badge variant="success" className="rounded-sm shadow-none uppercase tracking-wide text-[10px] px-2 py-0.5 font-bold">
                          {exp.status}
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
      
      <div className="flex justify-end p-4">
        <div className="text-right">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Operational Cost (Auto) = Fuel + Maint</p>
          <p className="text-3xl font-bold text-foreground">34,070</p>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Fuel">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vehicle</label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground">
              <option>VAN-05</option>
              <option>TRUCK-12</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Liters Added</label>
              <input required type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Cost (₹)</label>
              <input required type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" />
            </div>
          </div>
          <div className="pt-6 flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="border-border text-foreground hover:bg-muted/50">Cancel</Button>
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Save Entry</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
