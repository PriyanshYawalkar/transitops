"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Plus } from "lucide-react";

const mockVehicles = [
  { id: "V001", reg: "MH 12 AB 1234", name: "Van-05", type: "Van", cap: "500 kg", odo: "45,000 km", status: "Available" },
  { id: "V002", reg: "KA 01 XY 9876", name: "Truck-01", type: "Heavy Truck", cap: "5000 kg", odo: "120,000 km", status: "On Trip" },
  { id: "V003", reg: "CG 04 AF 0001", name: "Van-02", type: "Van", cap: "600 kg", odo: "89,000 km", status: "In Shop" },
  { id: "V004", reg: "GJ 05 PQ 7890", name: "Pickup-03", type: "Pickup", cap: "1200 kg", odo: "15,000 km", status: "Available" },
];

export default function VehiclesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between bg-white p-4 rounded-md border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-500 font-medium border-r border-slate-200 pr-4">
            Filter: 
            <select className="ml-2 border border-slate-200 rounded text-slate-700 bg-slate-50 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-yellow-500">
              <option>Vehicle Type: All</option>
            </select>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            <select className="border border-slate-200 rounded text-slate-700 bg-slate-50 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-yellow-500">
              <option>Status: All</option>
            </select>
          </div>
        </div>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-none h-9" onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </div>

      <Card className="border border-slate-200 shadow-sm bg-white rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-[10px] uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold tracking-wider">Reg No. (Unique)</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Vehicle</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Type</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Capacity</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Odomtr</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Avg Cost</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-900">
              {mockVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-slate-50 bg-white">
                  <td className="px-6 py-4 font-medium text-slate-900">{vehicle.reg}</td>
                  <td className="px-6 py-4">{vehicle.name}</td>
                  <td className="px-6 py-4">{vehicle.type}</td>
                  <td className="px-6 py-4">{vehicle.cap}</td>
                  <td className="px-6 py-4">{vehicle.odo}</td>
                  <td className="px-6 py-4">--</td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      vehicle.status === "Available" ? "success" : 
                      vehicle.status === "On Trip" ? "info" : 
                      vehicle.status === "In Shop" ? "warning" : "secondary"
                    } className="rounded-sm shadow-none uppercase tracking-wide text-[10px] px-2 py-0.5 font-bold">
                      {vehicle.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Vehicle">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          {/* Form details omitted for brevity, keeping it functional */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Registration Number</label>
              <input required className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500" placeholder="e.g. CG 04 AF 0001" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Name/Model</label>
              <input required className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500" placeholder="e.g. Van-05" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Vehicle Type</label>
              <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500">
                <option>Van</option>
                <option>Pickup</option>
                <option>Heavy Truck</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Max Capacity (kg)</label>
              <input required type="number" className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500" placeholder="500" />
            </div>
          </div>
          <div className="pt-6 flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="border-slate-200 text-slate-600">Cancel</Button>
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Save Vehicle</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
