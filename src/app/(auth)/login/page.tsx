"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Checkbox } from "@/components/ui/Checkbox"; // We might need to implement this or use standard input
import { AlertCircle, Hexagon } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TEMPORARY LOCAL BYPASS
    if (email === "test@transitops.io" && password === "test123") {
      localStorage.setItem("test_user_loggedIn", "true");
      window.location.href = "/";
      return;
    }

    if (!auth) {
      setError("Firebase is not initialized. Please set environment variables.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      setError("Invalid credentials.");
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      
      {/* LEFT PANEL: Dark Theme */}
      <div className="hidden lg:flex lg:w-1/3 bg-[#1E1E1E] flex-col justify-between p-12 text-white">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-yellow-500 p-2 rounded-md">
              <Hexagon className="h-6 w-6 text-black fill-current" />
            </div>
            <h1 className="text-2xl font-bold tracking-wide">TransitOps</h1>
          </div>
          <p className="text-sm text-slate-400 font-medium">Smart Transport Operations Platform</p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">One login, four roles:</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Fleet Manager</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Dispatcher</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Safety Officer</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Financial Analyst</li>
          </ul>
        </div>

        <div className="text-xs text-slate-500">
          TRANSITOPS © 2024 RBAC ADM
        </div>
      </div>

      {/* RIGHT PANEL: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="w-full max-w-sm mx-auto space-y-8">
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Sign in to your account</h2>
            <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Email</label>
              <input
                type="email"
                required
                className="w-full flex h-11 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 transition-colors"
                placeholder="manager@transitops.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Password</label>
              <input
                type="password"
                required
                className="w-full flex h-11 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="h-4 w-4 rounded border-slate-300 text-yellow-500 focus:ring-yellow-500" />
                <label htmlFor="remember" className="text-sm font-medium text-slate-700">Remember me</label>
              </div>
              <Link href="#" className="text-sm font-medium text-slate-700 hover:text-black">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="p-3 border border-red-200 bg-red-50 text-red-600 rounded-md flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error} Account locked after 5 failed attempts.
              </div>
            )}

            <Button className="w-full h-11 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-base" type="submit">
              Sign In
            </Button>
          </form>

          <div className="pt-8 text-xs text-slate-500 space-y-1">
            <p>Access is scoped by role after login:</p>
            <ul className="space-y-1 list-disc list-inside ml-1">
              <li>Fleet Manager - Fleet, Maintenance</li>
              <li>Dispatcher - Dashboard, Trips</li>
              <li>Safety Officer - Drivers, Compliance</li>
              <li>Financial Analyst - Fuel & Expenses, Analytics</li>
            </ul>
          </div>
          
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-yellow-600 font-semibold hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
