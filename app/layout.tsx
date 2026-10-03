import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "State Sports Command Center · Jharkhand",
  description:
    "Departmental oversight of academies & Performance Excellence Centers — anti-fraud, resources, finance and athlete welfare.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <ToastProvider>
          <div className="flex min-h-screen bg-canvas">
            <Sidebar />
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
