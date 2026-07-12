"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Plus } from "lucide-react";

const mockDrivers = [
  { id: "D001", name: "Rahul Sharma", license: "MH12-2015-1234567", category: "Heavy Commercial", expiry: "2027-05-12", score: 98, status: "Available" },
  { id: "D002", name: "Priya Patel", license: "KA01-2018-9876543", category: "Light Commercial", expiry: "2024-11-01", score: 85, status: "On Trip" },
  { id: "D003", name: "Amit Kumar", license: "DL04-2012-4567890", category: "Heavy Commercial", expiry: "2024-08-15", score: 72, status: "Suspended" },
  { id: "D004", name: "Sneha Desai", license: "GJ05-2020-7890123", category: "Light Commercial", expiry: "2026-02-20", score: 95, status: "Available" },
];

export default function DriversPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-md border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-500 font-medium border-r border-slate-200 pr-4">
            Filter: 
            <select className="ml-2 border border-slate-200 rounded text-slate-700 bg-slate-50 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-yellow-500">
              <option>Status: All</option>
            </select>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            <input type="search" placeholder="Search driver..." className="border border-slate-200 rounded text-slate-700 bg-slate-50 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 w-48" />
          </div>
        </div>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-none h-9" onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Driver
        </Button>
      </div>

      <Card className="border border-slate-200 shadow-sm bg-white rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-[10px] uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold tracking-wider">Driver Name</th>
                <th className="px-6 py-3 font-semibold tracking-wider">License No.</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Category</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Expiry</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Safety Score</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-900">
              {mockDrivers.map((driver) => {
                const isExpiringSoon = new Date(driver.expiry).getTime() - new Date().getTime() < 90 * 24 * 60 * 60 * 1000;
                return (
                  <tr key={driver.id} className="hover:bg-slate-50 bg-white">
                    <td className="px-6 py-4 font-medium text-slate-900">{driver.name}</td>
                    <td className="px-6 py-4">{driver.license}</td>
                    <td className="px-6 py-4">{driver.category}</td>
                    <td className="px-6 py-4">
                      <span className={isExpiringSoon ? "text-red-500 font-medium" : ""}>{driver.expiry}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="mr-2 text-xs font-semibold">{driver.score}</span>
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${driver.score >= 90 ? 'bg-green-500' : driver.score >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                            style={{ width: `${driver.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        driver.status === "Available" ? "success" : 
                        driver.status === "On Trip" ? "info" : 
                        driver.status === "Off Duty" ? "secondary" : "destructive"
                      } className="rounded-sm shadow-none uppercase tracking-wide text-[10px] px-2 py-0.5 font-bold">
                        {driver.status}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Driver">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Full Name</label>
            <input required className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500" placeholder="e.g. Rahul Sharma" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">License Number</label>
              <input required className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500" placeholder="e.g. MH12-2015-1234567" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">License Expiry</label>
              <input required type="date" className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Category</label>
              <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500">
                <option>Light Commercial</option>
                <option>Heavy Commercial</option>
                <option>Hazardous Material</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Contact Number</label>
              <input required type="tel" className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500" placeholder="+1 (555) 000-0000" />
            </div>
          </div>
          <div className="pt-6 flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="border-slate-200 text-slate-600">Cancel</Button>
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Save Driver</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
