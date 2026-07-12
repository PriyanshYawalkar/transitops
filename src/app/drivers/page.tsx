"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { UserPlus, Search, Filter } from "lucide-react";

const mockDrivers = [
  { id: "D001", name: "Rahul Sharma", license: "MH12-2015-1234567", category: "Heavy Commercial", expiry: "2027-05-12", score: 98, status: "Available" },
  { id: "D002", name: "Priya Patel", license: "KA01-2018-9876543", category: "Light Commercial", expiry: "2024-11-01", score: 85, status: "On Trip" },
  { id: "D003", name: "Amit Kumar", license: "DL04-2012-4567890", category: "Heavy Commercial", expiry: "2024-08-15", score: 72, status: "Suspended" },
  { id: "D004", name: "Sneha Desai", license: "GJ05-2020-7890123", category: "Light Commercial", expiry: "2026-02-20", score: 95, status: "Available" },
];

export default function DriversPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Drivers</h1>
          <p className="text-muted-foreground">Manage your driving staff, licenses, and safety scores.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Driver
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
          <CardTitle>Driver Roster</CardTitle>
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
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">License No.</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Expiry Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Safety Score</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {mockDrivers.map((driver) => {
                  const isExpiringSoon = new Date(driver.expiry).getTime() - new Date().getTime() < 90 * 24 * 60 * 60 * 1000;
                  return (
                  <tr key={driver.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{driver.name}</td>
                    <td className="p-4 align-middle">{driver.license}</td>
                    <td className="p-4 align-middle">{driver.category}</td>
                    <td className="p-4 align-middle">
                      <span className={isExpiringSoon ? "text-red-500 font-medium" : ""}>{driver.expiry}</span>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center">
                        <span className="mr-2">{driver.score}/100</span>
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${driver.score >= 90 ? 'bg-green-500' : driver.score >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                            style={{ width: `${driver.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge variant={
                        driver.status === "Available" ? "success" : 
                        driver.status === "On Trip" ? "default" : 
                        driver.status === "Off Duty" ? "secondary" : "destructive"
                      }>
                        {driver.status}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Driver">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Full Name</label>
            <input required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="e.g. Rahul Sharma" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">License Number</label>
              <input required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="e.g. MH12-2015-1234567" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">License Expiry</label>
              <input required type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Category</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>Light Commercial</option>
                <option>Heavy Commercial</option>
                <option>Hazardous Material</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Contact Number</label>
              <input required type="tel" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="+1 (555) 000-0000" />
            </div>
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Driver</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
