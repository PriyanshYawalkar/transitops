"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Plus } from "lucide-react";
import { fetchApi } from "@/lib/api";

type Vehicle = {
  id: number;
  registration_number: string;
  vehicle_name: string;
  vehicle_type: string;
  maximum_load_capacity: number;
  odometer: number;
  acquisition_cost: number;
  status: string;
};

type VehicleDocument = {
  id: number;
  document_name: string;
  file_path: string;
  uploaded_at: string;
};

export default function VehiclesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [activeVehicleId, setActiveVehicleId] = useState<number | null>(null);
  const [documents, setDocuments] = useState<VehicleDocument[]>([]);
  const [docName, setDocName] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters & Search
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    registration_number: "",
    vehicle_name: "",
    vehicle_type: "Van",
    maximum_load_capacity: "",
    acquisition_cost: ""
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi("/vehicles");
      setVehicles(res.data || []);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/vehicles", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          maximum_load_capacity: Number(formData.maximum_load_capacity),
          acquisition_cost: Number(formData.acquisition_cost)
        })
      });
      setIsModalOpen(false);
      setFormData({
        registration_number: "",
        vehicle_name: "",
        vehicle_type: "Van",
        maximum_load_capacity: "",
        acquisition_cost: ""
      });
      loadVehicles();
    } catch (error: any) {
      alert("Failed to add vehicle: " + error.message);
    }
  };

  const openDocModal = async (vehicleId: number) => {
    setActiveVehicleId(vehicleId);
    setIsDocModalOpen(true);
    try {
      const res = await fetchApi(`/vehicles/${vehicleId}/documents`);
      setDocuments(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDocUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVehicleId) return;
    try {
      await fetchApi(`/vehicles/${activeVehicleId}/documents`, {
        method: "POST",
        body: JSON.stringify({ document_name: docName })
      });
      setDocName("");
      // Refresh docs
      const res = await fetchApi(`/vehicles/${activeVehicleId}/documents`);
      setDocuments(res.data || []);
    } catch (e: any) {
      alert("Failed to upload document: " + e.message);
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.registration_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.vehicle_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || v.vehicle_type === typeFilter;
    const matchesStatus = statusFilter === "All" || v.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between bg-card p-4 rounded-md border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground font-medium border-r border-border pr-4">
            Filter: 
            <select 
              className="ml-2 border border-input rounded text-foreground bg-muted px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="All">Vehicle Type: All</option>
              <option value="Van">Van</option>
              <option value="Pickup">Pickup</option>
              <option value="Heavy Truck">Heavy Truck</option>
            </select>
          </div>
          <div className="text-sm text-muted-foreground font-medium border-r border-border pr-4">
            <select 
              className="border border-input rounded text-foreground bg-muted px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">Status: All</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="In Shop">In Shop</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            <input 
              type="search" 
              placeholder="Search by name or reg..." 
              className="border border-input rounded text-foreground bg-muted px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-48" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-none h-9" onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </div>

      <Card className="border border-border shadow-sm bg-card rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-muted-foreground">
            <thead className="text-[10px] uppercase bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3 font-semibold tracking-wider">Reg No. (Unique)</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Vehicle</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Type</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Capacity</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Odomtr</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Acq Cost</th>
                <th className="px-6 py-3 font-semibold tracking-wider">Status</th>
                <th className="px-6 py-3 font-semibold tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-4">Loading vehicles...</td></tr>
              ) : filteredVehicles.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-4">No vehicles found.</td></tr>
              ) : filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{vehicle.registration_number}</td>
                  <td className="px-6 py-4">{vehicle.vehicle_name}</td>
                  <td className="px-6 py-4">{vehicle.vehicle_type}</td>
                  <td className="px-6 py-4">{vehicle.maximum_load_capacity} kg</td>
                  <td className="px-6 py-4">{vehicle.odometer} km</td>
                  <td className="px-6 py-4">₹{vehicle.acquisition_cost}</td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      vehicle.status === "Available" ? "success" : 
                      vehicle.status === "On Trip" ? "info" : 
                      vehicle.status === "In Shop" ? "warning" : "secondary"
                    } className="rounded-sm shadow-none uppercase tracking-wide text-[10px] px-2 py-0.5 font-bold">
                      {vehicle.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => openDocModal(vehicle.id)}>
                      Docs
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Vehicle">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Registration Number</label>
              <input 
                required 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" 
                placeholder="e.g. CG 04 AF 0001" 
                value={formData.registration_number}
                onChange={(e) => setFormData({...formData, registration_number: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name/Model</label>
              <input 
                required 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" 
                placeholder="e.g. Van-05" 
                value={formData.vehicle_name}
                onChange={(e) => setFormData({...formData, vehicle_name: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vehicle Type</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground"
                value={formData.vehicle_type}
                onChange={(e) => setFormData({...formData, vehicle_type: e.target.value})}
              >
                <option>Van</option>
                <option>Pickup</option>
                <option>Heavy Truck</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Max Capacity (kg)</label>
              <input 
                required 
                type="number" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" 
                placeholder="500" 
                value={formData.maximum_load_capacity}
                onChange={(e) => setFormData({...formData, maximum_load_capacity: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Acquisition Cost (₹)</label>
            <input 
              required 
              type="number" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" 
              placeholder="e.g. 500000" 
              value={formData.acquisition_cost}
              onChange={(e) => setFormData({...formData, acquisition_cost: e.target.value})}
            />
          </div>
          <div className="pt-6 flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="border-border text-foreground hover:bg-muted/50">Cancel</Button>
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Save Vehicle</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDocModalOpen} onClose={() => setIsDocModalOpen(false)} title="Vehicle Documents">
        <div className="space-y-6">
          <form className="flex gap-2" onSubmit={handleDocUpload}>
            <input 
              required
              type="text" 
              placeholder="e.g. Insurance Policy" 
              className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
            />
            <Button type="submit" size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold h-9">
              Add Record
            </Button>
          </form>

          <div className="border border-border rounded-md overflow-hidden bg-muted/20">
            <table className="w-full text-sm text-left text-muted-foreground">
              <thead className="text-[10px] uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-2">Document Name</th>
                  <th className="px-4 py-2">Date Added</th>
                  <th className="px-4 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground">
                {documents.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-4">No documents found.</td></tr>
                ) : documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-4 py-2 font-medium">{doc.document_name}</td>
                    <td className="px-4 py-2">{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-right">
                      <a href="#" className="text-blue-500 hover:underline text-xs">View/DL</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  );
}
