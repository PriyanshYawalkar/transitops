import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TransitOps | Smart Transport Operations Platform",
  description: "End-to-end transport operations platform that digitizes vehicle, driver, dispatch, maintenance, and expense management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground overflow-hidden`}>
        <div className="flex h-screen w-full relative">
          {/* Sidebar */}
          <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 z-50">
            <Sidebar />
          </div>
          
          {/* Main Content Area */}
          <main className="md:pl-64 flex-1 h-full flex flex-col relative overflow-hidden">
            <TopBar />
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
              <div className="mx-auto max-w-7xl h-full">
                {children}
              </div>
            </div>
            
            {/* Ambient Background Glow for Aesthetic */}
            <div className="pointer-events-none fixed top-1/4 -left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
            <div className="pointer-events-none fixed bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
          </main>
        </div>
      </body>
    </html>
  );
}
