"use client";

import { Card, CardContent } from "@/components/ui/Card";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      
      {/* KPI Bar */}
      <Card className="border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-nowrap overflow-x-auto divide-x divide-slate-200 bg-white">
          
          <div className="flex-1 min-w-[140px] p-4 flex flex-col justify-between">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Active Vehicles</p>
            <p className="text-2xl font-bold text-slate-800">53</p>
          </div>
          
          <div className="flex-1 min-w-[140px] p-4 flex flex-col justify-between">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Available Vehicles</p>
            <p className="text-2xl font-bold text-slate-800">42</p>
          </div>
          
          <div className="flex-1 min-w-[140px] p-4 flex flex-col justify-between">
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-2">Vehicles in Maintenance</p>
            <p className="text-2xl font-bold text-slate-800">05</p>
          </div>
          
          <div className="flex-1 min-w-[140px] p-4 flex flex-col justify-between">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Active Trips</p>
            <p className="text-2xl font-bold text-slate-800">18</p>
          </div>
          
          <div className="flex-1 min-w-[140px] p-4 flex flex-col justify-between">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Pending Trips</p>
            <p className="text-2xl font-bold text-slate-800">09</p>
          </div>

          <div className="flex-1 min-w-[140px] p-4 flex flex-col justify-between">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Drivers On Duty</p>
            <p className="text-2xl font-bold text-slate-800">26</p>
          </div>

          <div className="flex-1 min-w-[140px] p-4 flex flex-col justify-between bg-slate-50">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Fleet Utilization</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-green-600">89%</p>
            </div>
          </div>

        </div>
      </Card>
      
      {/* Activity and Charts */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Recent Trips */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Trips</h3>
          <Card className="border border-slate-200 shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-[10px] uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold tracking-wider">Trip</th>
                    <th className="px-4 py-3 font-semibold tracking-wider">Vehicle</th>
                    <th className="px-4 py-3 font-semibold tracking-wider">Driver</th>
                    <th className="px-4 py-3 font-semibold tracking-wider">Status</th>
                    <th className="px-4 py-3 font-semibold tracking-wider text-right">ETA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">TR001</td>
                    <td className="px-4 py-3">VAN-01</td>
                    <td className="px-4 py-3">Alex</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-sm text-xs font-medium bg-blue-600 text-white">On Trip</span>
                    </td>
                    <td className="px-4 py-3 text-right">45 min</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">TR002</td>
                    <td className="px-4 py-3">TRK-12</td>
                    <td className="px-4 py-3">Sam</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-sm text-xs font-medium bg-green-500 text-white">Completed</span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400">--</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">TR003</td>
                    <td className="px-4 py-3">MINI-01</td>
                    <td className="px-4 py-3">Priya</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-sm text-xs font-medium bg-blue-600 text-white">Dispatched</span>
                    </td>
                    <td className="px-4 py-3 text-right">In 15m</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">TR004</td>
                    <td className="px-4 py-3 text-slate-400">--</td>
                    <td className="px-4 py-3 text-slate-400">--</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-sm text-xs font-medium bg-slate-500 text-white">Draft</span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400 italic text-xs">Awaiting vehicle</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        {/* Vehicle Status */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle Status</h3>
          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardContent className="p-5 space-y-6">
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>Available</span>
                  <span className="font-bold text-slate-900">42</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[60%]"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>On Trip</span>
                  <span className="font-bold text-slate-900">18</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-[25%]"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>In Shop (Maintenance)</span>
                  <span className="font-bold text-slate-900">05</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[10%]"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>Retired / Inactive</span>
                  <span className="font-bold text-slate-900">09</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 w-[5%]"></div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  );
}
