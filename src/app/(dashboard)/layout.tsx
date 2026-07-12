"use client";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="flex h-screen w-full relative bg-white">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <main className="md:pl-64 flex-1 h-full flex flex-col relative overflow-hidden">
        <TopBar />
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 bg-[#f8fafc]">
          <div className="mx-auto max-w-7xl h-full">
            {children}
          </div>
        </div>
        
      </main>
    </div>
  );
}
