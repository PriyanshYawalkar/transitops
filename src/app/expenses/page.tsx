"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Fuel, Plus, DollarSign, TrendingUp } from "lucide-react";

const mockExpenses = [
  { id: "E-001", type: "Fuel", vehicle: "Van-05", amount: "$85.00", date: "2026-07-11", notes: "45 Liters" },
  { id: "E-002", type: "Toll", vehicle: "Truck-01", amount: "$15.50", date: "2026-07-11", notes: "NJ Turnpike" },
  { id: "E-003", type: "Maintenance", vehicle: "Van-02", amount: "$150.00", date: "2026-07-10", notes: "Oil Change" },
  { id: "E-004", type: "Fuel", vehicle: "Truck-01", amount: "$210.00", date: "2026-07-09", notes: "110 Liters" },
];

export default function ExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fuel & Expenses</h1>
          <p className="text-muted-foreground">Log fuel consumption and track operational costs.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Operational Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,231.50</div>
            <p className="text-xs text-muted-foreground mt-1">
              This Month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fuel Consumed</CardTitle>
            <Fuel className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">850 L</div>
            <p className="text-xs text-muted-foreground mt-1">
              $1,250.00 Total Fuel Cost
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Fuel Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5 km/L</div>
            <p className="text-xs text-muted-foreground mt-1">
              +1.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
          <CardTitle>Expense History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b border-border">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Vehicle</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Notes</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {mockExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{expense.id}</td>
                    <td className="p-4 align-middle">
                      <Badge variant="outline" className={expense.type === 'Fuel' ? 'border-orange-500 text-orange-500' : ''}>
                        {expense.type}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">{expense.vehicle}</td>
                    <td className="p-4 align-middle">{expense.date}</td>
                    <td className="p-4 align-middle text-muted-foreground">{expense.notes}</td>
                    <td className="p-4 align-middle text-right font-medium">{expense.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log New Expense">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Expense Type</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>Fuel</option>
                <option>Toll</option>
                <option>Maintenance</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Vehicle (Optional)</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option value="">Select Vehicle</option>
                <option value="v1">Van-05</option>
                <option value="v2">Truck-01</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Amount ($)</label>
              <input required type="number" step="0.01" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Date</label>
              <input required type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Notes / Description</label>
            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="e.g. 45 Liters of Diesel" />
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Expense</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
