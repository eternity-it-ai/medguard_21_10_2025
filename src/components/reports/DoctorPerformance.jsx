import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DoctorPerformance({ procedures, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            ביצועי רופאים
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const doctorStats = procedures
    .filter(p => p.doctor_name)
    .reduce((acc, procedure) => {
      if (!acc[procedure.doctor_name]) {
        acc[procedure.doctor_name] = {
          total: 0,
          approved: 0,
          rejected: 0,
          pending: 0
        };
      }
      acc[procedure.doctor_name].total++;
      acc[procedure.doctor_name][procedure.approval_status]++;
      return acc;
    }, {});

  const doctorList = Object.entries(doctorStats)
    .map(([name, stats]) => ({
      name,
      ...stats,
      approvalRate: stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  if (doctorList.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            ביצועי רופאים
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
          <User className="w-5 h-5 text-blue-600" />
          ביצועי רופאים מובילים
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {doctorList.map((doctor, index) => (
          <div key={doctor.name} className="p-4 border border-slate-200 rounded-lg bg-white/60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {index === 0 && <Award className="w-5 h-5 text-yellow-500" />}
                <h3 className="font-semibold text-slate-900">{doctor.name}</h3>
              </div>
              <Badge 
                className={`${
                  doctor.approvalRate >= 90 ? 'bg-green-100 text-green-800' :
                  doctor.approvalRate >= 75 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}
              >
                {doctor.approvalRate}% אישור
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm text-slate-600">
              <div className="text-center">
                <div className="font-semibold text-slate-900">{doctor.total}</div>
                <div>סה"כ</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">{doctor.approved}</div>
                <div>מאושרות</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-red-600">{doctor.rejected}</div>
                <div>נדחו</div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}