import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function MonthlyTrends({ procedures, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            מגמות חודשיות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Skeleton className="w-full h-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group procedures by month
  const monthlyData = procedures.reduce((acc, procedure) => {
    const date = new Date(procedure.execution_date || procedure.created_date);
    const monthKey = format(date, 'yyyy-MM');
    const monthName = format(date, 'MMM yyyy');

    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthName,
        total: 0,
        approved: 0,
        rejected: 0,
        pending: 0
      };
    }

    acc[monthKey].total++;
    acc[monthKey][procedure.approval_status]++;
    return acc;
  }, {});

  const chartData = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6); // Last 6 months

  if (chartData.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            מגמות חודשיות
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-slate-500">אין נתונים להצגה</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          מגמות חודשיות - {chartData.length} חודשים אחרונים
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748B"
                fontSize={12}
              />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#F8FAFC', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="approved" stackId="a" fill="#22C55E" name="מאושרות" />
              <Bar dataKey="pending" stackId="a" fill="#F59E0B" name="בבדיקה" />
              <Bar dataKey="rejected" stackId="a" fill="#EF4444" name="נדחו" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}