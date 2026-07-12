"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { fetchApi } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    activeVehicles: 0,
    availableVehicles: 0,
    maintenanceVehicles: 0,
    activeTrips: 0,
    pendingTrips: 0,
    driversOnDuty: 0,
    utilization: 0
  });

  const [recentTrips, setRecentTrips] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any[]>([]);
  
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [vRes, dRes, tRes, eRes, fRes] = await Promise.all([
        fetchApi("/vehicles"),
        fetchApi("/drivers"),
        fetchApi("/trips"),
        fetchApi("/expenses"),
        fetchApi("/fuel")
      ]);

      const vehicles = vRes.data || [];
      const drivers = dRes.data || [];
      const trips = tRes.data || [];
      const expenses = eRes.data || [];
      const fuel = fRes.data || [];

      setStats({
        activeVehicles: vehicles.length,
        availableVehicles: vehicles.filter((v: any) => v.status === "Available").length,
        maintenanceVehicles: vehicles.filter((v: any) => v.status === "In Shop").length,
        activeTrips: trips.filter((t: any) => t.status === "Dispatched").length,
        pendingTrips: trips.filter((t: any) => t.status === "Draft").length,
        driversOnDuty: drivers.filter((d: any) => d.status === "On Trip").length,
        utilization: vehicles.length > 0 ? Math.round((trips.filter((t: any) => t.status === "Dispatched").length / vehicles.length) * 100) : 0
      });

      // Map recent trips
      const mappedTrips = trips.slice(-5).reverse().map((t: any) => ({
        ...t,
        vehicle: vehicles.find((v: any) => v.id === t.vehicle_id)?.vehicle_name || 'N/A',
        driver: drivers.find((d: any) => d.id === t.driver_id)?.name || 'N/A',
      }));
      setRecentTrips(mappedTrips);

      // Aggregate expenses & fuel for chart
      const chartDataMap: Record<string, {name: string, fuel: number, expenses: number}> = {};
      
      fuel.forEach((f: any) => {
        const month = new Date(f.date).toLocaleString('default', { month: 'short' });
        if (!chartDataMap[month]) chartDataMap[month] = { name: month, fuel: 0, expenses: 0 };
        chartDataMap[month].fuel += f.total_cost;
      });

      expenses.forEach((e: any) => {
        const month = new Date(e.date).toLocaleString('default', { month: 'short' });
        if (!chartDataMap[month]) chartDataMap[month] = { name: month, fuel: 0, expenses: 0 };
        chartDataMap[month].expenses += e.amount;
      });

      setExpenseData(Object.values(chartDataMap));

    } catch (error) {
      console.error("Dashboard data load failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* KPI Bar */}
      <Card className="border border-border shadow-sm overflow-hidden bg-card">
        <div className="flex flex-nowrap overflow-x-auto divide-x divide-border bg-card">
          
          <div className="flex-1 min-w-[140px] p-4 flex flex-col justify-between">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Vehicles</p>
            <p className="text-2xl font-bold text-foreground">{stats.activeVehicles}</p>
          </div>
          
          <div className="flex-1 min-w-[140px] p-4 flex flex-col justify-between">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Available</p>
            <p className="text-2xl font-bold text-foreground">{stats.availableVehicles}</p>
          </div>
          
          <div className="flex-1 min-w-[140px] p-4 flex flex-col justify-between">
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-2">In Maintenance</p>
            <p className="text-2xl font-bold text-foreground">{stats.maintenanceVehicles}</p>
          </div>
          
          <div className="flex-1 min-w-[140px] p-4 flex flex-col justify-between">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Active Trips</p>
            <p className="text-2xl font-bold text-foreground">{stats.activeTrips}</p>
          </div>
          
          <div className="flex-1 min-w-[140px] p-4 flex flex-col justify-between">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Pending Trips</p>
            <p className="text-2xl font-bold text-foreground">{stats.pendingTrips}</p>
          </div>

          <div className="flex-1 min-w-[140px] p-4 flex flex-col justify-between">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Drivers On Duty</p>
            <p className="text-2xl font-bold text-foreground">{stats.driversOnDuty}</p>
          </div>

          <div className="flex-1 min-w-[140px] p-4 flex flex-col justify-between bg-muted/50">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Fleet Utilization</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-green-500">{stats.utilization}%</p>
            </div>
          </div>

        </div>
      </Card>
      
      {/* Activity and Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Expenses Chart */}
        <Card className="border border-border shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Financial Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full pt-4">
            {expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="fuel" stackId="a" fill="#eab308" radius={[0, 0, 4, 4]} name="Fuel Costs" />
                  <Bar dataKey="expenses" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Other Expenses" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                No financial data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Trips */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recent Trips</h3>
          <Card className="border border-border shadow-sm bg-card h-[300px]">
            <div className="overflow-x-auto h-full">
              <table className="w-full text-sm text-left text-muted-foreground">
                <thead className="text-[10px] uppercase bg-muted/50 text-muted-foreground border-b border-border sticky top-0">
                  <tr>
                    <th className="px-4 py-3 font-semibold tracking-wider">Trip ID</th>
                    <th className="px-4 py-3 font-semibold tracking-wider">Vehicle</th>
                    <th className="px-4 py-3 font-semibold tracking-wider">Driver</th>
                    <th className="px-4 py-3 font-semibold tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentTrips.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-4">No recent trips.</td></tr>
                  ) : recentTrips.map((trip) => (
                    <tr key={trip.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">TR{trip.id.toString().padStart(3, '0')}</td>
                      <td className="px-4 py-3">{trip.vehicle}</td>
                      <td className="px-4 py-3">{trip.driver}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-sm text-xs font-medium text-white ${trip.status === 'Dispatched' ? 'bg-blue-600' : trip.status === 'Completed' ? 'bg-green-500' : trip.status === 'Draft' ? 'bg-slate-500' : 'bg-red-500'}`}>
                          {trip.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
      </div>
    </div>
  );
}
