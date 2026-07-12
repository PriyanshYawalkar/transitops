"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Truck, Activity, Wrench, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
            <Truck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 / 15</div>
            <p className="text-xs text-muted-foreground mt-1">
              80% Fleet Utilization
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2 from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">
              Scheduled this week
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">
              Driver license expiring soon
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Activity and Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Main Chart Placeholder */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Fleet Utilization Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full flex items-center justify-center border-2 border-dashed border-muted rounded-lg bg-muted/20">
              <span className="text-muted-foreground font-medium">Utilization Chart</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity List */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                { title: "Trip TR-1002 Completed", time: "2 hours ago", status: "success" },
                { title: "Vehicle Van-05 dispatched", time: "4 hours ago", status: "default" },
                { title: "Maintenance Log added for Truck-01", time: "1 day ago", status: "warning" },
                { title: "Driver Rahul registered", time: "2 days ago", status: "secondary" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center">
                  <span className="relative flex h-3 w-3 mr-4">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      activity.status === 'success' ? 'bg-green-400' :
                      activity.status === 'warning' ? 'bg-orange-400' :
                      activity.status === 'default' ? 'bg-primary' : 'bg-slate-400'
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-orange-500' :
                      activity.status === 'default' ? 'bg-primary' : 'bg-slate-500'
                    }`}></span>
                  </span>
                  <div className="ml-2 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
