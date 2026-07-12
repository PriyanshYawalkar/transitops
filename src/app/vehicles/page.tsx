"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Plus, Search, Filter } from "lucide-react";

const mockVehicles = [
  { id: "V001", reg: "MH 12 AB 1234", name: "Van-05", type: "Van", cap: "500 kg", odo: "45,000 km", status: "Available" },
  { id: "V002", reg: "KA 01 XY 9876", name: "Truck-01", type: "Heavy Truck", cap: "5000 kg", odo: "120,000 km", status: "On Trip" },
  { id: "V003", reg: "CG 04 AF 0001", name: "Van-02", type: "Van", cap: "600 kg", odo: "89,000 km", status: "In Shop" },
  { id: "V004", reg: "GJ 05 PQ 7890", name: "Pickup-03", type: "Pickup", cap: "1200 kg", odo: "15,000 km", status: "Available" },
];

export default function VehiclesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground">Manage your fleet, check status and capacity.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
          <CardTitle>Fleet Directory</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b border-border">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Reg No.</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name/Model</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Capacity</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Odometer</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {mockVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{vehicle.reg}</td>
                    <td className="p-4 align-middle">{vehicle.name}</td>
                    <td className="p-4 align-middle">{vehicle.type}</td>
                    <td className="p-4 align-middle">{vehicle.cap}</td>
                    <td className="p-4 align-middle">{vehicle.odo}</td>
                    <td className="p-4 align-middle">
                      <Badge variant={
                        vehicle.status === "Available" ? "success" : 
                        vehicle.status === "On Trip" ? "default" : 
                        vehicle.status === "In Shop" ? "warning" : "secondary"
                      }>
                        {vehicle.status}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Vehicle">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Registration Number</label>
              <input required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="e.g. CG 04 AF 0001" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Name/Model</label>
              <input required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="e.g. Van-05" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Vehicle Type</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>Van</option>
                <option>Pickup</option>
                <option>Heavy Truck</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Max Capacity (kg)</label>
              <input required type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Initial Odometer (km)</label>
              <input required type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="0" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Acquisition Cost ($)</label>
              <input required type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="25000" />
            </div>
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Vehicle</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
