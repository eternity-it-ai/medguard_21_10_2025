import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, Loader2 } from "lucide-react";

export default function AuditProgress({ progress }) {
  const percentage = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg text-slate-900">
          <Activity className="w-5 h-5 text-purple-600" />
          התקדמות ביקורת
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
          <span className="text-sm text-slate-700">
            מעבד {progress.current} מתוך {progress.total}
          </span>
        </div>
        
        <Progress 
          value={percentage} 
          className="h-2 bg-slate-200"
        />
        
        <div className="text-center">
          <span className="text-2xl font-bold text-purple-600">
            {percentage}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}