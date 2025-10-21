import React, { useState, useEffect } from "react";
import MedicalProcedure from "@/entities/MedicalProcedure.json";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, PieChart, TrendingUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

import StatsOverview from "../components/reports/StatsOverview";
import ProcedureChart from "../components/reports/ProcedureChart";
import DoctorPerformance from "../components/reports/DoctorPerformance";
import MonthlyTrends from "../components/reports/MonthlyTrends";

export default function Reports() {
  const [procedures, setProcedures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await MedicalProcedure.list("-created_date");
      // Filter by date range
      const filtered = data.filter(p => {
        const procedureDate = p.execution_date || p.created_date;
        return procedureDate >= dateRange.from && procedureDate <= dateRange.to;
      });
      setProcedures(filtered);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const exportReport = () => {
    // Create CSV data
    const headers = ['תאריך', 'מטופל', 'פרוצדורה', 'רופא', 'סטטוס', 'רמת סיכון'];
    const csvData = procedures.map(p => [
      p.execution_date || p.created_date,
      p.patient_id,
      p.procedure_name,
      p.doctor_name || '',
      p.approval_status,
      p.risk_level || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `medical_procedures_report_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">דוחות ותובנות</h1>
                <p className="text-slate-600 mt-1">ניתוח ביצועים וסטטיסטיקות מערכת</p>
              </div>
            </div>

            <Button
              onClick={exportReport}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg gap-2"
            >
              <Download className="w-4 h-4" />
              ייצא דוח
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <StatsOverview procedures={procedures} isLoading={isLoading} />

          <div className="grid lg:grid-cols-2 gap-8">
            <ProcedureChart procedures={procedures} isLoading={isLoading} />
            <DoctorPerformance procedures={procedures} isLoading={isLoading} />
          </div>

          <MonthlyTrends procedures={procedures} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}