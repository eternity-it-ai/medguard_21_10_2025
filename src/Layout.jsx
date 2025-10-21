import { useState } from "react";
import { useLiveStats } from "@/api/Stats.js";
import React from "react";
import {Link, Outlet, useLocation} from "react-router-dom";
import { createPageUrl } from "@/lib/utils";
import {
  Search,
  FileCheck,
  Settings,
  BarChart3,
  Stethoscope,
  Shield,
  FileX
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "בדיקת פרוצדורה",
    url: createPageUrl("ProcedureCheck"),
    icon: Search,
    description: "בדיקה מיידית של פרוצדורות מתוכננות"
  },
  {
    title: "ביקורת רטרואקטיבית",
    url: createPageUrl("AuditReview"),
    icon: FileCheck,
    description: "ביקורת פרוצדורות שבוצעו"
  },
  {
    title: "ניהול חוקיות",
    url: createPageUrl("ComplianceManagement"),
    icon: Settings,
    description: "הגדרת כללי חוקיות"
  },
  {
    title: "דוחות ותובנות",
    url: createPageUrl("Reports"),
    icon: BarChart3,
    description: "דוחות ואנליטיקה"
  }
];

export default function Layout() {
  const location = useLocation();

  const [stats, setStats] = useState(null);
  useLiveStats(setStats);

  return (
    <SidebarProvider>
      <div className="min-h-screen min-h-full h-auto flex flex-row w-full bg-gradient-to-br from-slate-50 to-blue-50 direction-rtl mr-[300px]">

        <Sidebar className="border-l border-slate-200/60 bg-white/95 backdrop-blur-sm fixed right-0 top-0 h-screen overflow-hidden z-50">
          <SidebarHeader className="border-b border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <Shield className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">MedGuard</h2>
                <p className="text-xs text-slate-500">מערכת בקרה רפואית</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 py-3">
                תפריט ראשי
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-blue-50/80 hover:text-blue-700 transition-all duration-300 rounded-xl mb-2 group ${
                          location.pathname === item.url 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25' 
                            : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-start gap-4 px-4 py-3">
                          <item.icon className={`w-5 h-5 mt-0.5 transition-transform duration-300 group-hover:scale-110 ${
                            location.pathname === item.url ? 'text-white' : 'text-slate-500'
                          }`} />
                          <div className="flex-1 text-right">
                            <span className="font-semibold text-sm block">{item.title}</span>
                            <span className={`text-xs block ${
                              location.pathname === item.url ? 'text-blue-100' : 'text-slate-400'
                            }`}>
                              {item.description}
                            </span>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 py-3">
                סטטיסטיקות מהירות
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-3 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">פרוצדורות השבוע</span>
                    <span className="font-bold text-green-600">{stats?.last_7_days ?? '-'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">דורשות בדיקה</span>
                    <span className="font-bold text-amber-600">{stats?.needs_review ?? '-'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">נדחו</span>
                    <span className="font-bold text-red-600">{stats?.rejected ?? '-'}</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/60 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white font-semibold">
                ר
              </div>
              <div className="flex-1 text-right">
                <p className="font-semibold text-slate-900 text-sm">ד"ר רון כהן</p>
                <p className="text-xs text-slate-500">רופא שיניים בכיר</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-900">MedGuard</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </SidebarProvider>
  );
}