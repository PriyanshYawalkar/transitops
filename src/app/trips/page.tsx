"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Plus, MapPin, Navigation } from "lucide-react";

const mockTrips = [
  { id: "TR-1004", source: "Warehouse A (Mumbai)", dest: "Distribution Center (Pune)", vehicle: "Van-05", driver: "Rahul Sharma", status: "Draft", distance: "150 km" },
  { id: "TR-1003", source: "Port Terminal (JNPT)", dest: "Warehouse B (Thane)", vehicle: "Truck-01", driver: "Priya Patel", status: "Dispatched", distance: "45 km" },
  { id: "TR-1002", source: "Distribution Center (Pune)", dest: "Retail Store (Nashik)", vehicle: "Van-02", driver: "Sneha Desai", status: "Completed", distance: "210 km" },
];

export default function TripsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trip Management</h1>
          <p className="text-muted-foreground">Dispatch vehicles, track routes, and monitor active trips.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Trip
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Kanban-style Columns */}
        
        {/* Draft */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-medium text-sm text-muted-foreground">Draft</h3>
            <Badge variant="secondary">1</Badge>
          </div>
          {mockTrips.filter(t => t.status === "Draft").map(trip => (
            <Card key={trip.id} className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-semibold">{trip.id}</span>
                  <Badge variant="secondary">{trip.status}</Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-2 h-3 w-3" /> {trip.source}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Navigation className="mr-2 h-3 w-3" /> {trip.dest}
                  </div>
                </div>
                <div className="pt-2 border-t flex justify-between text-xs text-muted-foreground">
                  <span>{trip.vehicle}</span>
                  <span>{trip.driver}</span>
                </div>
                <Button className="w-full mt-2" size="sm">Dispatch</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dispatched / On Trip */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-medium text-sm text-muted-foreground">Dispatched</h3>
            <Badge variant="secondary">1</Badge>
          </div>
          {mockTrips.filter(t => t.status === "Dispatched").map(trip => (
            <Card key={trip.id} className="cursor-pointer hover:border-primary/50 transition-colors border-l-4 border-l-primary">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-semibold">{trip.id}</span>
                  <Badge variant="default">{trip.status}</Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-2 h-3 w-3" /> {trip.source}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Navigation className="mr-2 h-3 w-3" /> {trip.dest}
                  </div>
                </div>
                <div className="pt-2 border-t flex justify-between text-xs text-muted-foreground">
                  <span>{trip.vehicle}</span>
                  <span>{trip.driver}</span>
                </div>
                <Button variant="outline" className="w-full mt-2" size="sm">Complete Trip</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Completed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-medium text-sm text-muted-foreground">Completed</h3>
            <Badge variant="secondary">1</Badge>
          </div>
          {mockTrips.filter(t => t.status === "Completed").map(trip => (
            <Card key={trip.id} className="opacity-75">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-semibold line-through text-muted-foreground">{trip.id}</span>
                  <Badge variant="success">{trip.status}</Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-2 h-3 w-3" /> {trip.source}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Navigation className="mr-2 h-3 w-3" /> {trip.dest}
                  </div>
                </div>
                <div className="pt-2 border-t flex justify-between text-xs text-muted-foreground">
                  <span>{trip.vehicle}</span>
                  <span>{trip.driver}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Trip">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Source Location</label>
              <input required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="e.g. Warehouse A" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Destination</label>
              <input required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="e.g. Distribution Center" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Assign Vehicle</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option value="">Select Available Vehicle</option>
                <option value="v1">Van-05 (500kg cap)</option>
                <option value="v4">Pickup-03 (1200kg cap)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Assign Driver</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option value="">Select Available Driver</option>
                <option value="d1">Rahul Sharma</option>
                <option value="d4">Sneha Desai</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Cargo Weight (kg)</label>
              <input required type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="450" />
              <p className="text-[10px] text-muted-foreground">Must be &le; Vehicle Capacity</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Planned Distance (km)</label>
              <input required type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="150" />
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Draft Trip</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
