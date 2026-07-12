"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { ExportPDFButton } from "@/components/ui/ExportPDFButton";
import { fetchApi } from "@/lib/api";

type Vehicle = {
  id: number;
  registration_number: string;
  vehicle_name: string;
};

type FuelLog = {
  id: number;
  vehicle_id: number;
  liters: number;
  cost_per_liter: number;
  total_cost: number;
  date: string;
  vehicle?: Vehicle;
};

type Expense = {
  id: number;
  vehicle_id: number;
  category: string;
  amount: number;
  description: string;
  date: string;
  vehicle?: Vehicle;
};

export default function ExpensesPage() {
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [fuelFormData, setFuelFormData] = useState({
    vehicle_id: "",
    liters: "",
    total_cost: "",
    date: new Date().toISOString().split("T")[0]
  });

  const [expenseFormData, setExpenseFormData] = useState({
    vehicle_id: "",
    category: "toll",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [vRes, fRes, eRes] = await Promise.all([
        fetchApi("/vehicles"),
        fetchApi("/fuel"),
        fetchApi("/expenses")
      ]);
      const allVehicles = vRes.data || [];
      setVehicles(allVehicles);

      const mappedFuel = (fRes.data || []).map((f: FuelLog) => ({
        ...f,
        vehicle: allVehicles.find((v: Vehicle) => v.id === f.vehicle_id)
      }));
      setFuelLogs(mappedFuel);

      const mappedExpenses = (eRes.data || []).map((e: Expense) => ({
        ...e,
        vehicle: allVehicles.find((v: Vehicle) => v.id === e.vehicle_id)
      }));
      setExpenses(mappedExpenses);
    } catch (e) {
      console.error("Failed to load expenses data", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFuelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const liters = Number(fuelFormData.liters);
      const totalCost = Number(fuelFormData.total_cost);
      
      await fetchApi("/fuel", {
        method: "POST",
        body: JSON.stringify({
          vehicle_id: Number(fuelFormData.vehicle_id),
          liters: liters,
          cost_per_liter: totalCost / liters,
          date: new Date(fuelFormData.date).toISOString()
        })
      });
      setIsFuelModalOpen(false);
      setFuelFormData({
        vehicle_id: "",
        liters: "",
        total_cost: "",
        date: new Date().toISOString().split("T")[0]
      });
      loadData();
    } catch (e: any) {
      alert("Failed to log fuel: " + e.message);
    }
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/expenses", {
        method: "POST",
        body: JSON.stringify({
          vehicle_id: expenseFormData.vehicle_id ? Number(expenseFormData.vehicle_id) : undefined,
          category: expenseFormData.category,
          amount: Number(expenseFormData.amount),
          description: expenseFormData.description,
          date: new Date(expenseFormData.date).toISOString()
        })
      });
      setIsExpenseModalOpen(false);
      setExpenseFormData({
        vehicle_id: "",
        category: "toll",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0]
      });
      loadData();
    } catch (e: any) {
      alert("Failed to log expense: " + e.message);
    }
  };

  const totalFuelCost = fuelLogs.reduce((acc, log) => acc + log.total_cost, 0);
  const totalOtherCost = expenses.reduce((acc, exp) => acc + exp.amount, 0);

  const fuelExportData = fuelLogs.map(log => [
    log.vehicle?.registration_number || `V${log.vehicle_id}`,
    new Date(log.date).toLocaleDateString(),
    `${log.liters.toFixed(1)} L`,
    `Rs. ${log.total_cost.toLocaleString()}`
  ]);

  const expenseExportData = expenses.map(exp => [
    exp.vehicle?.registration_number || "-",
    exp.category,
    exp.description || "-",
    `Rs. ${exp.amount.toLocaleString()}`
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Expenses & Fuel</h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fuel Logs</h2>
            <div className="flex gap-2">
              <ExportPDFButton 
                title="Fuel Logs Report"
                columns={["Vehicle", "Date", "Liters", "Cost"]}
                data={fuelExportData}
                fileName="Fuel_Logs_Report"
              />
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-none h-8 text-xs px-3" onClick={() => setIsFuelModalOpen(true)}>
                + Log Fuel
              </Button>
            </div>
          </div>
          <Card className="border border-border shadow-sm bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-muted-foreground">
                <thead className="text-[10px] uppercase bg-muted/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-semibold tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 font-semibold tracking-wider">Date</th>
                    <th className="px-6 py-3 font-semibold tracking-wider">Liters</th>
                    <th className="px-6 py-3 font-semibold tracking-wider text-right">Cost (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {isLoading ? (
                    <tr><td colSpan={4} className="text-center py-4">Loading...</td></tr>
                  ) : fuelLogs.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-4">No fuel logs found.</td></tr>
                  ) : fuelLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{log.vehicle?.registration_number || `V${log.vehicle_id}`}</td>
                      <td className="px-6 py-4">{new Date(log.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{log.liters.toFixed(1)} L</td>
                      <td className="px-6 py-4 text-right">₹{log.total_cost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="lg:w-1/2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Other Expenses</h2>
            <div className="flex gap-2">
              <ExportPDFButton 
                title="Expenses Report"
                columns={["Vehicle", "Category", "Description", "Amount"]}
                data={expenseExportData}
                fileName="Expenses_Report"
              />
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-none h-8 text-xs px-3" onClick={() => setIsExpenseModalOpen(true)}>
                + Add Expense
              </Button>
            </div>
          </div>
          <Card className="border border-border shadow-sm bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-muted-foreground">
                <thead className="text-[10px] uppercase bg-muted/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-semibold tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 font-semibold tracking-wider">Category</th>
                    <th className="px-6 py-3 font-semibold tracking-wider">Desc</th>
                    <th className="px-6 py-3 font-semibold tracking-wider">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {isLoading ? (
                    <tr><td colSpan={4} className="text-center py-4">Loading...</td></tr>
                  ) : expenses.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-4">No expenses found.</td></tr>
                  ) : expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{exp.vehicle?.registration_number || "-"}</td>
                      <td className="px-6 py-4 capitalize">{exp.category}</td>
                      <td className="px-6 py-4">{exp.description || "-"}</td>
                      <td className="px-6 py-4 text-right">₹{exp.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-end p-4">
        <div className="text-right">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Expenses Recorded</p>
          <p className="text-3xl font-bold text-foreground">₹{(totalFuelCost + totalOtherCost).toLocaleString()}</p>
        </div>
      </div>

      <Modal isOpen={isFuelModalOpen} onClose={() => setIsFuelModalOpen(false)} title="Log Fuel">
        <form className="space-y-4" onSubmit={handleFuelSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vehicle</label>
            <select 
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground"
              value={fuelFormData.vehicle_id}
              onChange={e => setFuelFormData({...fuelFormData, vehicle_id: e.target.value})}
            >
              <option value="">Select Vehicle</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.registration_number}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Liters Added</label>
              <input 
                required 
                type="number" 
                step="0.01"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" 
                value={fuelFormData.liters}
                onChange={e => setFuelFormData({...fuelFormData, liters: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Cost (₹)</label>
              <input 
                required 
                type="number" 
                step="0.01"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" 
                value={fuelFormData.total_cost}
                onChange={e => setFuelFormData({...fuelFormData, total_cost: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</label>
            <input 
              required 
              type="date" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" 
              value={fuelFormData.date}
              onChange={e => setFuelFormData({...fuelFormData, date: e.target.value})}
            />
          </div>
          <div className="pt-6 flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={() => setIsFuelModalOpen(false)} className="border-border text-foreground hover:bg-muted/50">Cancel</Button>
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Save Entry</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Log Expense">
        <form className="space-y-4" onSubmit={handleExpenseSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</label>
            <select 
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground"
              value={expenseFormData.category}
              onChange={e => setExpenseFormData({...expenseFormData, category: e.target.value})}
            >
              <option value="toll">Toll</option>
              <option value="maintenance">Maintenance</option>
              <option value="parking">Parking</option>
              <option value="salary">Salary</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vehicle (Optional)</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground"
              value={expenseFormData.vehicle_id}
              onChange={e => setExpenseFormData({...expenseFormData, vehicle_id: e.target.value})}
            >
              <option value="">None / N/A</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.registration_number}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Amount (₹)</label>
              <input 
                required 
                type="number" 
                step="0.01"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" 
                value={expenseFormData.amount}
                onChange={e => setExpenseFormData({...expenseFormData, amount: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</label>
              <input 
                required 
                type="date" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" 
                value={expenseFormData.date}
                onChange={e => setExpenseFormData({...expenseFormData, date: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</label>
            <input 
              type="text" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" 
              placeholder="E.g. Toll booth 4"
              value={expenseFormData.description}
              onChange={e => setExpenseFormData({...expenseFormData, description: e.target.value})}
            />
          </div>
          <div className="pt-6 flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={() => setIsExpenseModalOpen(false)} className="border-border text-foreground hover:bg-muted/50">Cancel</Button>
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Save Expense</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
