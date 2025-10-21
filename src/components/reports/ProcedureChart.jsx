import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = {
  approved: '#22C55E',
  requires_review: '#F59E0B',
  rejected: '#EF4444'
};

const STATUS_NAMES = {
  approved: 'מאושרות',
  requires_review: 'בבדיקה',
  rejected: 'נדחו'
};

export default function ProcedureChart({ procedures, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            התפלגות פרוצדורות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <Skeleton className="w-48 h-48 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusCounts = procedures.reduce((acc, procedure) => {
    acc[procedure.approval_status] = (acc[procedure.approval_status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: STATUS_NAMES[status] || status,
    value: count,
    color: COLORS[status] || '#94A3B8'
  }));

  if (chartData.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-blue-600" />
            התפלגות פרוצדורות
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
          <PieChartIcon className="w-5 h-5 text-blue-600" />
          התפלגות פרוצדורות
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}