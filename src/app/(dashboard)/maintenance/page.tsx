"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Wrench } from "lucide-react";
import { fetchApi } from "@/lib/api";

type Vehicle = {
  id: number;
  registration_number: string;
  vehicle_name: string;
};

type MaintenanceRecord = {
  id: number;
  vehicle_id: number;
  description: string;
  cost: number;
  service_date: string;
  next_service_date?: string;
  status: string;
  vehicle?: Vehicle;
};

export default function MaintenancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    vehicle_id: "",
    description: "",
    cost: "",
    service_date: new Date().toISOString().split("T")[0]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [vRes, mRes] = await Promise.all([
        fetchApi("/vehicles"),
        fetchApi("/maintenance")
      ]);
      const allVehicles = vRes.data || [];
      setVehicles(allVehicles);
      
      const mappedRecords = (mRes.data || []).map((m: MaintenanceRecord) => ({
        ...m,
        vehicle: allVehicles.find((v: Vehicle) => v.id === m.vehicle_id)
      }));
      setRecords(mappedRecords);
    } catch (error) {
      console.error("Failed to load maintenance data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/maintenance", {
        method: "POST",
        body: JSON.stringify({
          vehicle_id: Number(formData.vehicle_id),
          description: formData.description,
          cost: Number(formData.cost),
          service_date: new Date(formData.service_date).toISOString()
        })
      });
      setIsModalOpen(false);
      setFormData({
        vehicle_id: "",
        description: "",
        cost: "",
        service_date: new Date().toISOString().split("T")[0]
      });
      loadData();
    } catch (e: any) {
      alert("Failed to schedule maintenance: " + e.message);
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await fetchApi(`/maintenance/${id}/complete`, { method: "POST" });
      loadData();
    } catch (e: any) {
      alert("Failed to complete maintenance: " + e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Maintenance Schedule</h1>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-none h-9" onClick={() => setIsModalOpen(true)}>
          <Wrench className="mr-2 h-4 w-4" /> Schedule Service
        </Button>
      </div>

      <Card className="border border-border shadow-sm bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-muted-foreground">
            <thead className="text-[10px] uppercase bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3 font-semibold tracking-wider">Vehicle</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Service Task</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Scheduled Date</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Cost Est.</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Status</th>
                <th className="px-6 py-3 font-semibold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4">No maintenance records found.</td></tr>
              ) : records.map((record) => (
                <tr key={record.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{record.vehicle?.registration_number || `V${record.vehicle_id}`}</td>
                  <td className="px-6 py-4">{record.description}</td>
                  <td className="px-6 py-4">{new Date(record.service_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">₹{record.cost}</td>
                  <td className="px-6 py-4">
                    <Badge variant={record.status === "completed" ? "success" : "warning"} className="rounded-sm shadow-none uppercase tracking-wide text-[10px] px-2 py-0.5 font-bold">
                      {record.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {record.status === "pending" && (
                      <Button variant="outline" size="sm" onClick={() => handleComplete(record.id)}>Mark Complete</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Maintenance">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Select Vehicle</label>
            <select 
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground"
              value={formData.vehicle_id}
              onChange={e => setFormData({...formData, vehicle_id: e.target.value})}
            >
              <option value="">Choose...</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.registration_number}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Service Description</label>
            <input 
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" 
              placeholder="e.g. Engine Oil Replacement"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Estimated Cost (₹)</label>
              <input 
                required
                type="number" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" 
                placeholder="2500"
                value={formData.cost}
                onChange={e => setFormData({...formData, cost: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Service Date</label>
              <input 
                required
                type="date" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" 
                value={formData.service_date}
                onChange={e => setFormData({...formData, service_date: e.target.value})}
              />
            </div>
          </div>
          <div className="pt-6 flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="border-border text-foreground hover:bg-muted/50">Cancel</Button>
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Schedule Service</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
