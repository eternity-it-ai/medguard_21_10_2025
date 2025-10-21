import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, FileText, Calendar, Stethoscope } from "lucide-react";

export default function ProcedureForm({ formData, onChange, disabled }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
          <FileText className="w-6 h-6 text-blue-600" />
          פרטי הפרוצדורה
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patient_id" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              מזהה מטופל *
            </Label>
            <Input
              id="patient_id"
              value={formData.patient_id}
              onChange={(e) => onChange("patient_id", e.target.value)}
              disabled={disabled}
              placeholder="מספר זהות / מזהה מטופל"
              className="bg-white/80 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="procedure_code" className="text-sm font-semibold text-slate-700">
              קוד פרוצדורה
            </Label>
            <Input
              id="procedure_code"
              value={formData.procedure_code}
              onChange={(e) => onChange("procedure_code", e.target.value)}
              disabled={disabled}
              placeholder="לדוגמה: D7140"
              className="bg-white/80 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="procedure_name" className="text-sm font-semibold text-slate-700">
            שם הפרוצדורה
          </Label>
          <Input
            id="procedure_name"
            value={formData.procedure_name}
            onChange={(e) => onChange("procedure_name", e.target.value)}
            disabled={disabled}
            placeholder="לדוגמה: עקירה כירורגית"
            className="bg-white/80 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="doctor_name" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              רופא מבצע
            </Label>
            <Input
              id="doctor_name"
              value={formData.doctor_name}
              onChange={(e) => onChange("doctor_name", e.target.value)}
              disabled={disabled}
              placeholder="שם הרופא"
              className="bg-white/80 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="execution_date" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              תאריך מתוכנן
            </Label>
            <Input
              id="execution_date"
              type="date"
              value={formData.execution_date}
              onChange={(e) => onChange("execution_date", e.target.value)}
              disabled={disabled}
              className="bg-white/80 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-semibold text-slate-700">
            הערות נוספות
          </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            disabled={disabled}
            placeholder="הערות רלוונטיות לפרוצדורה..."
            className="bg-white/80 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 h-24"
          />
        </div>
      </CardContent>
    </Card>
  );
}
