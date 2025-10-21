import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsOverview({ procedures, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = {
    total: procedures.length,
    approved: procedures.filter(p => p.approval_status === 'approved').length,
    pending: procedures.filter(p => p.approval_status === 'requires_review').length,
    rejected: procedures.filter(p => p.approval_status === 'rejected').length,
  };

  const cards = [
    {
      title: "סה״כ פרוצדורות",
      value: stats.total,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "מאושרות",
      value: stats.approved,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      percentage: stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0
    },
    {
      title: "בבדיקה",
      value: stats.pending,
      icon: AlertTriangle,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      percentage: stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0
    },
    {
      title: "נדחו",
      value: stats.rejected,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      percentage: stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              {card.percentage !== undefined && (
                <div className="text-right">
                  <div className={`text-sm font-semibold ${card.color}`}>
                    {card.percentage}%
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {card.value}
            </div>
            <div className="text-sm text-slate-600">
              {card.title}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}