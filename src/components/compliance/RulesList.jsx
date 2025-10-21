import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Edit, AlertTriangle } from "lucide-react";

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const getActionColor = (action) => {
  switch (action) {
    case 'approve':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'require_review':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'reject':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const getActionText = (action) => {
  switch (action) {
    case 'approve':
      return 'אישור אוטומטי';
    case 'require_review':
      return 'דרוש אישור';
    case 'reject':
      return 'דחייה אוטומטית';
    default:
      return action;
  }
};

const getSeverityText = (severity) => {
  switch (severity) {
    case 'low':
      return 'נמוכה';
    case 'medium':
      return 'בינונית';
    case 'high':
      return 'גבוהה';
    case 'critical':
      return 'קריטית';
    default:
      return severity;
  }
};

export default function RulesList({ rules, isLoading, onEdit, onToggle }) {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
        <CardHeader>
          <CardTitle>כללי חוקיות</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          כללי חוקיות ({rules.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {rules.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              לא הוגדרו כללי חוקיות
            </h3>
            <p className="text-slate-600">
              הוסף כלל חדש כדי להתחיל
            </p>
          </div>
        ) : (
          rules.map((rule) => (
            <div 
              key={rule.id} 
              className="p-6 border border-slate-200 rounded-xl bg-white/60 backdrop-blur-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg text-slate-900">
                      {rule.rule_name}
                    </h3>
                    <Switch
                      checked={rule.is_active}
                      onCheckedChange={() => onToggle(rule)}
                      className="data-[state=checked]:bg-green-600"
                    />
                  </div>

                  <div className="flex gap-2 mb-3">
                    <Badge className={`border ${getSeverityColor(rule.severity)}`}>
                      {getSeverityText(rule.severity)}
                    </Badge>
                    <Badge className={`border ${getActionColor(rule.action)}`}>
                      {getActionText(rule.action)}
                    </Badge>
                  </div>

                  <p className="text-slate-600 mb-3">
                    {rule.description || rule.condition}
                  </p>

                  {rule.procedure_codes && rule.procedure_codes.length > 0 && (
                    <div className="text-sm text-slate-500">
                      <strong>קודי פרוצדורה:</strong> {rule.procedure_codes.join(", ")}
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(rule)}
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" />
                  ערוך
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}