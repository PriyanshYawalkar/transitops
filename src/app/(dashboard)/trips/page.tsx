"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Navigation, AlertCircle } from "lucide-react";

// Updated mock data reflecting the mockup
const mockVehicles = [
  { id: "V1", name: "VAN-05 - 500 kg capacity", capacity: 500, driver: "Alex" },
  { id: "V2", name: "TRUCK-04 - 2000 kg capacity", capacity: 2000, driver: "Suresh" },
  { id: "V3", name: "TRUCK-01 - 5000 kg capacity", capacity: 5000, driver: "Rahul" },
];

const mockDrivers = [
  { id: "D1", name: "Alex" },
  { id: "D2", name: "Suresh" },
  { id: "D3", name: "Rahul" },
];

const mockTrips = [
  {
    id: "TR001",
    vehicle: "VAN-05",
    driver: "ALEX",
    source: "Gandhinagar Depot",
    destination: "Ahmedabad Hub",
    status: "Dispatched",
    timeInfo: "45 min",
  },
  {
    id: "TR004",
    vehicle: "TRUCK-04",
    driver: "SURESH",
    source: "Vatva Industrial Area",
    destination: "Sanand Warehouse",
    status: "Draft",
    timeInfo: "Awaiting driver",
  },
  {
    id: "TR006",
    vehicle: "Unassigned",
    driver: "",
    source: "Mansa",
    destination: "Kalol Depot",
    status: "Cancelled",
    timeInfo: "Vehicle went to maint...",
  },
];

export default function TripsPage() {
  const [cargoWeight, setCargoWeight] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const selectedVehicle = mockVehicles.find(v => v.id === selectedVehicleId);
  const capacityExceeded = selectedVehicle && Number(cargoWeight) > selectedVehicle.capacity;

  const handleTripComplete = () => {
    setShowCompletionModal(true);
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
          <div className="flex-1 space-y-4">
            <h2 className="text-sm font-semibold tracking-wider uppercase">Create TR:</h2>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Source</label>
                <input
                  type="text"
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Gandhinagar Depot"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Destination</label>
                <input
                  type="text"
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Ahmedabad Hub"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Vehicle (Available Only)</label>
                <select
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                >
                  <option value="">Select Vehicle</option>
                  {mockVehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Driver (Available Only)</label>
                <select className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="">Select Driver</option>
                  {mockDrivers.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Cargo Weight (KG)</label>
                <input
                  type="number"
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="700"
                  value={cargoWeight}
                  onChange={(e) => setCargoWeight(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Planned Distance (KM)</label>
                <input
                  type="number"
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="38"
                />
              </div>
            </div>

            {/* Validation Warning */}
            {capacityExceeded && (
              <div className="mt-4 p-3 border border-red-200 bg-red-50 text-red-600 rounded-md flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                Vehicle Capacity: {selectedVehicle.capacity} kg. Cargo weight exceeds limit!
              </div>
            )}

            <Button className="w-full mt-6" disabled={capacityExceeded || !cargoWeight || !selectedVehicleId}>
              Create Trip
            </Button>
          </div>
        </div>

        {/* RIGHT PANE: Live Board */}
        <div className="lg:w-2/3 space-y-4 border-l pl-8 pb-10">
          <h2 className="text-sm font-semibold tracking-wider uppercase mb-6">Live Board</h2>

          <div className="space-y-4">
            {mockTrips.map((trip) => (
              <Card key={trip.id} className="relative overflow-hidden border-dashed bg-card">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-lg font-mono font-semibold text-foreground">{trip.id}</span>
                    <span className="text-sm font-medium text-muted-foreground">
                      {trip.vehicle} {trip.driver && `/ ${trip.driver}`}
                    </span>
                  </div>

                  <div className="flex items-center text-md mb-6 text-foreground">
                    {trip.source} <Navigation className="mx-2 h-4 w-4 text-muted-foreground rotate-90" /> {trip.destination}
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      variant={trip.status === "Dispatched" ? "default" : trip.status === "Draft" ? "secondary" : "destructive"}
                      className={`
                        w-32 rounded-lg 
                        ${trip.status === 'Dispatched' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
                        ${trip.status === 'Draft' ? 'bg-muted hover:bg-muted/80 text-foreground' : ''}
                        ${trip.status === 'Cancelled' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
                      `}
                      onClick={trip.status === "Dispatched" ? handleTripComplete : undefined}
                    >
                      {trip.status}
                    </Button>
                    <span className="text-sm text-muted-foreground italic">
                      {trip.timeInfo}
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
          <p className="text-sm text-muted-foreground">Log the final odometer reading and any incurred fuel/expenses before completing the trip.</p>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Final Odometer</label>
            <input type="number" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background text-foreground" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Fuel Added (Liters)</label>
            <input type="number" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background text-foreground" />
          </div>
          <Button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" onClick={() => setShowCompletionModal(false)}>Mark as Completed</Button>
        </div>
      </Modal>
    </div>
  );
}
