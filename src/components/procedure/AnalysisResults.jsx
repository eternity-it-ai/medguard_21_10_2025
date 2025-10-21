import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Brain, Shield, TrendingUp } from "lucide-react";

const getStatusIcon = (status) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'requires_review':
      return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    case 'rejected':
      return <XCircle className="w-5 h-5 text-red-600" />;
    default:
      return null;
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'approved':
      return 'מאושרת לביצוע';
    case 'requires_review':
      return 'דרוש בדיקה נוספת';
    case 'rejected':
      return 'לא מומלצת לביצוע';
    default:
      return 'לא ידוע';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'requires_review':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const getRiskColor = (risk) => {
  switch (risk) {
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'medium':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const getRiskText = (risk) => {
  switch (risk) {
    case 'low':
      return 'נמוכה';
    case 'medium':
      return 'בינונית';
    case 'high':
      return 'גבוהה';
    default:
      return 'לא ידועה';
  }
};

const normalizeRisk = (risk) => {
  if (["בינונית", "בינוני", "medium"].includes(risk)) return "medium";
  if (["נמוכה", "נמוך", "low"].includes(risk)) return "low";
  if (["גבוהה", "גבוה", "high"].includes(risk)) return "high";
  return "unknown";
};

export default function AnalysisResults({ results }) {
  const { ai_analysis, compliance_status, compliance_notes, relevant_rules } = results;

  return (
    <div className="space-y-6">
      {/* סטטוס כללי */}
      <Card className="bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
            {getStatusIcon(compliance_status)}
            תוצאות הניתוח
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <Badge className={`text-lg px-6 py-3 border ${getStatusColor(compliance_status)}`}>
              {getStatusText(compliance_status)}
            </Badge>
            <p className="text-slate-600 mt-4 text-lg leading-relaxed">
              {compliance_notes}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ניתוח AI */}
      <Card className="bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
            <Brain className="w-6 h-6 text-purple-600" />
            ניתוח בינה מלאכותית
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border">
              <h4 className="font-semibold text-slate-900 mb-2">רמת סיכון</h4>
              <Badge className={`border ${getRiskColor(normalizeRisk(ai_analysis.risk_level))}`}>
                {getRiskText(normalizeRisk(ai_analysis.risk_level))}
              </Badge>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border">
              <h4 className="font-semibold text-slate-900 mb-2">רמת ביטחון</h4>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-blue-600">{ai_analysis.confidence}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-slate-900 mb-2">ממצאים</h4>
              <p className="text-slate-700 leading-relaxed">{ai_analysis.findings}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-slate-900 mb-2">המלצות</h4>
              <p className="text-slate-700 leading-relaxed">{ai_analysis.recommendations}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className={`w-4 h-4 mx-auto mb-2 rounded-full ${
                ai_analysis.medical_justification === false ? 'bg-red-500' : 'bg-green-500'
              }`} />
              <p className="text-sm font-medium text-slate-700">
                {ai_analysis.medical_justification === false ? 'אין הצדקה רפואית' : 'הצדקה רפואית'}
              </p>
            </div>
            <div className="text-center">
              <div className={`w-4 h-4 mx-auto mb-2 rounded-full ${
                ai_analysis.contraindications === true ? 'bg-red-500' : 'bg-green-500'
              }`} />
              <p className="text-sm font-medium text-slate-700">
                {ai_analysis.contraindications === true ? 'יש התוויות נגד' : 'ללא התוויות נגד'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* חוקיות */}
      <Card className="bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
            <Shield className="w-6 h-6 text-blue-600" />
            בדיקת חוקיות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4">
            <p className="text-slate-600 mb-2">
              נבדקו {relevant_rules} כללי חוקיות רלוונטיים
            </p>
            <p className="text-sm text-slate-500">
              הניתוח התבסס על הכללים הפעילים במערכת
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}