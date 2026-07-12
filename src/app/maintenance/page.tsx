"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Wrench, CalendarPlus } from "lucide-react";

const mockMaintenance = [
  { id: "M-001", vehicle: "Van-02", date: "2026-07-10", type: "Oil Change", cost: "$150", status: "Completed" },
  { id: "M-002", vehicle: "Truck-01", date: "2026-07-15", type: "Tire Replacement", cost: "Pending", status: "Scheduled" },
  { id: "M-003", vehicle: "Pickup-03", date: "2026-07-12", type: "Brake Inspection", cost: "$85", status: "In Progress" },
];

export default function MaintenancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Maintenance</h1>
          <p className="text-muted-foreground">Log vehicle maintenance to automatically switch vehicle status to In Shop.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <CalendarPlus className="mr-2 h-4 w-4" /> Log Maintenance
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
          <CardTitle>Maintenance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b border-border">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Log ID</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Vehicle</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cost</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {mockMaintenance.map((record) => (
                  <tr key={record.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{record.id}</td>
                    <td className="p-4 align-middle flex items-center">
                      <Wrench className="h-3 w-3 mr-2 text-muted-foreground" /> {record.vehicle}
                    </td>
                    <td className="p-4 align-middle">{record.date}</td>
                    <td className="p-4 align-middle">{record.type}</td>
                    <td className="p-4 align-middle font-medium">{record.cost}</td>
                    <td className="p-4 align-middle">
                      <Badge variant={
                        record.status === "Completed" ? "success" : 
                        record.status === "In Progress" ? "warning" : "secondary"
                      }>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-right">
                      {record.status !== "Completed" && (
                        <Button variant="ghost" size="sm">Complete</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Maintenance Record">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Vehicle</label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option value="">Select Vehicle</option>
              <option value="v1">Van-05</option>
              <option value="v2">Truck-01</option>
              <option value="v3">Pickup-03</option>
            </select>
            <p className="text-[10px] text-muted-foreground">Adding this record will change the vehicle's status to "In Shop"</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Maintenance Type</label>
              <input required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="e.g. Oil Change" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Scheduled Date</label>
              <input required type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Estimated Cost ($)</label>
            <input type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="100" />
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Log Maintenance</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
