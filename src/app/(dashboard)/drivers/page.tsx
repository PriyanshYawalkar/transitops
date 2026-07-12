"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Plus } from "lucide-react";
import { fetchApi } from "@/lib/api";

type Driver = {
  id: number;
  name: string;
  license_number: string;
  category: string;
  license_category: string;
  license_expiry_date: string;
  safety_score: number;
  status: string;
};

export default function DriversPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Sorting
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [formData, setFormData] = useState({
    name: "",
    license_number: "",
    license_expiry_date: "",
    license_category: "Light Commercial",
    contact_number: "",
    safety_score: 100
  });

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi("/drivers");
      setDrivers(res.data || []);
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/drivers", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          license_expiry_date: new Date(formData.license_expiry_date).toISOString()
        })
      });
      setIsModalOpen(false);
      setFormData({
        name: "",
        license_number: "",
        license_expiry_date: "",
        license_category: "Light Commercial",
        contact_number: "",
        safety_score: 100
      });
      loadDrivers();
    } catch (error: any) {
      alert("Failed to add driver: " + error.message);
    }
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === "desc" ? "asc" : "desc");
  };

  const filteredAndSortedDrivers = drivers
    .filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            d.license_number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.safety_score - b.safety_score;
      return b.safety_score - a.safety_score;
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-card p-4 rounded-md border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground font-medium border-r border-border pr-4">
            Filter: 
            <select 
              className="ml-2 border border-input rounded text-foreground bg-muted px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">Status: All</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="Off Duty">Off Duty</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            <input 
              type="search" 
              placeholder="Search driver by name or license..." 
              className="border border-input rounded text-foreground bg-muted px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-64" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-none h-9" onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Driver
        </Button>
      </div>

      <Card className="border border-border shadow-sm bg-card rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-muted-foreground">
            <thead className="text-[10px] uppercase bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3 font-semibold tracking-wider">Driver Name</th>
                <th className="px-6 py-3 font-semibold tracking-wider">License No.</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Category</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Expiry</th>
                <th className="px-6 py-3 font-semibold tracking-wider cursor-pointer hover:text-foreground" onClick={toggleSort}>
                  Safety Score {sortOrder === 'desc' ? '↓' : '↑'}
                </th>
                <th className="px-6 py-3 font-semibold tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-4">Loading drivers...</td></tr>
              ) : filteredAndSortedDrivers.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4">No drivers found.</td></tr>
              ) : filteredAndSortedDrivers.map((driver) => {
                const isExpiringSoon = new Date(driver.license_expiry_date).getTime() - new Date().getTime() < 90 * 24 * 60 * 60 * 1000;
                return (
                  <tr key={driver.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{driver.name}</td>
                    <td className="px-6 py-4">{driver.license_number}</td>
                    <td className="px-6 py-4">{driver.license_category}</td>
                    <td className="px-6 py-4">
                      <span className={isExpiringSoon ? "text-red-500 font-medium" : ""}>
                        {new Date(driver.license_expiry_date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="mr-2 text-xs font-semibold">{driver.safety_score}</span>
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${driver.safety_score >= 90 ? 'bg-green-500' : driver.safety_score >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                            style={{ width: `${driver.safety_score}%` }}
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
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Full Name</label>
            <input 
              required 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" 
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">License Number</label>
              <input 
                required 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" 
                placeholder="e.g. MH12-2015-1234567"
                value={formData.license_number}
                onChange={(e) => setFormData({...formData, license_number: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">License Expiry</label>
              <input 
                required 
                type="date" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" 
                value={formData.license_expiry_date}
                onChange={(e) => setFormData({...formData, license_expiry_date: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground"
                value={formData.license_category}
                onChange={(e) => setFormData({...formData, license_category: e.target.value})}
              >
                <option>Light Commercial</option>
                <option>Heavy Commercial</option>
                <option>Hazardous Material</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contact Number</label>
              <input 
                required 
                type="tel" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" 
                placeholder="+1 (555) 000-0000"
                value={formData.contact_number}
                onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
              />
            </div>
          </div>
          <div className="pt-6 flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="border-border text-foreground hover:bg-muted/50">Cancel</Button>
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Save Driver</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
