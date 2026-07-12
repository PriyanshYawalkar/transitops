"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Navigation, AlertCircle } from "lucide-react";
import { fetchApi } from "@/lib/api";

type Vehicle = {
  id: number;
  registration_number: string;
  vehicle_name: string;
  maximum_load_capacity: number;
  status: string;
};

type Driver = {
  id: number;
  name: string;
  status: string;
};

type Trip = {
  id: number;
  vehicle_id: number;
  driver_id: number;
  source: string;
  destination: string;
  status: string;
  cargo_weight: number;
  planned_distance: number;
  vehicle?: Vehicle;
  driver?: Driver;
  created_at: string;
};

export default function TripsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    vehicle_id: "",
    driver_id: "",
    cargo_weight: "",
    planned_distance: ""
  });

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [activeTripForCompletion, setActiveTripForCompletion] = useState<Trip | null>(null);
  const [completionData, setCompletionData] = useState({
    distance_km: "",
    fuel_added: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [vRes, dRes, tRes] = await Promise.all([
        fetchApi("/vehicles?status=Available"),
        fetchApi("/drivers?status=Available"),
        fetchApi("/trips")
      ]);
      
      setVehicles(vRes.data || []);
      setDrivers(dRes.data || []);
      
      const [allVRes, allDRes] = await Promise.all([
        fetchApi("/vehicles"),
        fetchApi("/drivers")
      ]);
      const allVehicles = allVRes.data || [];
      const allDrivers = allDRes.data || [];

      const tripsWithDetails = (tRes.data || []).map((t: Trip) => ({
        ...t,
        vehicle: allVehicles.find((v: Vehicle) => v.id === t.vehicle_id),
        driver: allDrivers.find((d: Driver) => d.id === t.driver_id)
      }));

      setTrips(tripsWithDetails);
    } catch (e) {
      console.error("Failed to fetch data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedVehicle = vehicles.find(v => v.id.toString() === formData.vehicle_id);
  const capacityExceeded = selectedVehicle && Number(formData.cargo_weight) > selectedVehicle.maximum_load_capacity;

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/trips", {
        method: "POST",
        body: JSON.stringify({
          source: formData.source,
          destination: formData.destination,
          vehicle_id: Number(formData.vehicle_id),
          driver_id: Number(formData.driver_id),
          cargo_weight: Number(formData.cargo_weight),
          planned_distance: formData.planned_distance ? Number(formData.planned_distance) : undefined
        })
      });
      setFormData({
        source: "",
        destination: "",
        vehicle_id: "",
        driver_id: "",
        cargo_weight: "",
        planned_distance: ""
      });
      loadData();
    } catch (e: any) {
      alert("Failed to create trip: " + e.message);
    }
  };

  const handleDispatchTrip = async (tripId: number) => {
    try {
      await fetchApi(`/trips/${tripId}/start`, { method: "POST" });
      loadData();
    } catch (e: any) {
      alert("Failed to dispatch trip: " + e.message);
    }
  };

  const handleCancelTrip = async (tripId: number) => {
    if (!confirm("Are you sure you want to cancel this trip?")) return;
    try {
      await fetchApi(`/trips/${tripId}/cancel`, { method: "POST" });
      loadData();
    } catch (e: any) {
      alert("Failed to cancel trip: " + e.message);
    }
  };

  const openCompletionModal = (trip: Trip) => {
    setActiveTripForCompletion(trip);
    setShowCompletionModal(true);
  };

  const submitCompletion = async () => {
    if (!activeTripForCompletion) return;
    try {
      await fetchApi(`/trips/${activeTripForCompletion.id}/complete`, {
        method: "POST",
        body: JSON.stringify({
          distance_km: completionData.distance_km ? Number(completionData.distance_km) : undefined
        })
      });
      
      if (completionData.fuel_added) {
        await fetchApi("/fuel", {
          method: "POST",
          body: JSON.stringify({
            vehicle_id: activeTripForCompletion.vehicle_id,
            driver_id: activeTripForCompletion.driver_id,
            liters: Number(completionData.fuel_added),
            cost_per_liter: 100, // Dummy cost
            total_cost: Number(completionData.fuel_added) * 100,
            date: new Date().toISOString()
          })
        }).catch(e => console.error("Fuel log failed", e));
      }

      setShowCompletionModal(false);
      setCompletionData({ distance_km: "", fuel_added: "" });
      setActiveTripForCompletion(null);
      loadData();
    } catch (e: any) {
      alert("Failed to complete trip: " + e.message);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold tracking-tight">Trip Dispatcher</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* LEFT PANE: Create Trip */}
        <div className="lg:w-1/3 flex flex-col space-y-8">
          
          {/* Trip Lifecycle Stepper */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-4">Trip Lifecycle</h2>
            <div className="flex items-center justify-between relative px-2">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border -z-10 rounded-full"></div>
              
              <div className="flex flex-col items-center gap-1 z-10 bg-background px-1">
                <div className="w-5 h-5 rounded-full bg-green-500 ring-4 ring-background"></div>
                <span className="text-xs font-medium text-green-600">Draft</span>
              </div>
              
              <div className="flex flex-col items-center gap-1 z-10 bg-background px-1">
                <div className="w-5 h-5 rounded-full bg-blue-500 ring-4 ring-background"></div>
                <span className="text-xs font-medium text-blue-600">Dispatched</span>
              </div>
              
              <div className="flex flex-col items-center gap-1 z-10 bg-background px-1">
                <div className="w-5 h-5 rounded-full bg-muted ring-4 ring-background"></div>
                <span className="text-xs font-medium text-muted-foreground">Completed</span>
              </div>

              <div className="flex flex-col items-center gap-1 z-10 bg-background px-1">
                <div className="w-5 h-5 rounded-full bg-muted ring-4 ring-background"></div>
                <span className="text-xs font-medium text-muted-foreground">Cancelled</span>
              </div>
            </div>
          </div>

          {/* Create Form */}
          <form className="flex-1 space-y-4" onSubmit={handleCreateTrip}>
            <h2 className="text-sm font-semibold tracking-wider uppercase">Create TR:</h2>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Source</label>
                <input 
                  required
                  type="text" 
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Gandhinagar Depot" 
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Destination</label>
                <input 
                  required
                  type="text" 
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Ahmedabad Hub" 
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Vehicle (Available Only)</label>
                <select 
                  required
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.vehicle_id}
                  onChange={(e) => setFormData({...formData, vehicle_id: e.target.value})}
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.registration_number} - {v.vehicle_name} ({v.maximum_load_capacity}kg)</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Driver (Available Only)</label>
                <select 
                  required
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.driver_id}
                  onChange={(e) => setFormData({...formData, driver_id: e.target.value})}
                >
                  <option value="">Select Driver</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Cargo Weight (KG)</label>
                <input 
                  required
                  type="number" 
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="700"
                  value={formData.cargo_weight}
                  onChange={(e) => setFormData({...formData, cargo_weight: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Planned Distance (KM)</label>
                <input 
                  type="number" 
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="38" 
                  value={formData.planned_distance}
                  onChange={(e) => setFormData({...formData, planned_distance: e.target.value})}
                />
              </div>
            </div>

            {/* Validation Warning */}
            {capacityExceeded && (
              <div className="mt-4 p-3 border border-red-200 bg-red-50 text-red-600 rounded-md flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                Vehicle Capacity: {selectedVehicle.maximum_load_capacity} kg. Cargo weight exceeds limit!
              </div>
            )}

            <Button type="submit" className="w-full mt-6" disabled={capacityExceeded || !formData.cargo_weight || !formData.vehicle_id || !formData.driver_id}>
              Create Trip
            </Button>
          </form>
        </div>

        {/* RIGHT PANE: Live Board */}
        <div className="lg:w-2/3 space-y-4 border-l border-border pl-8 pb-10 overflow-y-auto">
          <h2 className="text-sm font-semibold tracking-wider uppercase mb-6">Live Board</h2>
          
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-muted-foreground">Loading trips...</p>
            ) : trips.length === 0 ? (
              <p className="text-muted-foreground">No trips found.</p>
            ) : trips.map((trip) => (
              <Card key={trip.id} className="relative overflow-hidden border-dashed bg-card">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-lg font-mono font-semibold text-foreground">TR{trip.id.toString().padStart(3, '0')}</span>
                    <span className="text-sm font-medium text-muted-foreground">
                      {trip.vehicle?.vehicle_name || "Unknown"} {trip.driver?.name && `/ ${trip.driver.name}`}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-md mb-6 text-foreground">
                    {trip.source} <Navigation className="mx-2 h-4 w-4 text-muted-foreground rotate-90" /> {trip.destination}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {trip.status === "Draft" && (
                        <>
                          <Button variant="outline" className="w-32 rounded-lg bg-muted hover:bg-muted/80 text-foreground" onClick={() => handleDispatchTrip(trip.id)}>
                            Dispatch
                          </Button>
                          <Button variant="outline" className="rounded-lg text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleCancelTrip(trip.id)}>
                            Cancel
                          </Button>
                        </>
                      )}
                      
                      {trip.status === "Dispatched" && (
                        <Button className="w-32 rounded-lg bg-blue-600 hover:bg-blue-700 text-white" onClick={() => openCompletionModal(trip)}>
                          Complete Trip
                        </Button>
                      )}

                      {trip.status === "Completed" && (
                        <Button disabled className="w-32 rounded-lg bg-green-600/50 text-white">
                          Completed
                        </Button>
                      )}
                      
                      {trip.status === "Cancelled" && (
                        <Button disabled variant="destructive" className="w-32 rounded-lg">
                          Cancelled
                        </Button>
                      )}
                    </div>
                    
                    <span className="text-sm text-muted-foreground italic">
                      {new Date(trip.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-8 italic">
            On Complete: odometer → fuel log → expenses → Vehicle & Driver Available
          </p>
        </div>
      </div>

      <Modal 
        isOpen={showCompletionModal} 
        onClose={() => setShowCompletionModal(false)}
        title="Complete Trip"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Log the final distance and any incurred fuel/expenses before completing the trip.</p>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Actual Distance Travelled (km)</label>
            <input 
              type="number" 
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background text-foreground"
              value={completionData.distance_km}
              onChange={(e) => setCompletionData({...completionData, distance_km: e.target.value})} 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Fuel Added (Liters) [Optional]</label>
            <input 
              type="number" 
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background text-foreground"
              value={completionData.fuel_added}
              onChange={(e) => setCompletionData({...completionData, fuel_added: e.target.value})} 
            />
          </div>
          <Button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" onClick={submitCompletion}>Mark as Completed</Button>
        </div>
      </Modal>
    </div>
  );
}
