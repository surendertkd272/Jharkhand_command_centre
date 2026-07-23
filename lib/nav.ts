import {
  LayoutDashboard,
  ShieldCheck,
  Boxes,
  Banknote,
  HeartPulse,
  Activity,
  Building2,
  Bell,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV: NavItem[] = [
  { label: "Command Overview", href: "/", icon: LayoutDashboard },
  { label: "Anti-Fraud & Identity", href: "/integrity", icon: ShieldCheck },
  { label: "Resources & Assets", href: "/resources", icon: Boxes },
  { label: "Financial Controls", href: "/finance", icon: Banknote },
  { label: "Athlete Welfare", href: "/welfare", icon: HeartPulse },
  { label: "Load & Recovery", href: "/monitoring", icon: Activity },
  { label: "Academies & PECs", href: "/academies", icon: Building2 },
  { label: "Alerts", href: "/alerts", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];
