import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save } from "lucide-react";

export default function RuleForm({ rule, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    rule_name: rule?.rule_name || "",
    condition: rule?.condition || "",
    action: rule?.action || "require_review",
    severity: rule?.severity || "medium",
    description: rule?.description || "",
    procedure_codes: rule?.procedure_codes || [],
    is_active: rule?.is_active !== undefined ? rule.is_active : true
  });

  const [newProcedureCode, setNewProcedureCode] = useState("");

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addProcedureCode = () => {
    if (newProcedureCode.trim() && !formData.procedure_codes.includes(newProcedureCode.trim())) {
      setFormData(prev => ({
        ...prev,
        procedure_codes: [...prev.procedure_codes, newProcedureCode.trim()]
      }));
      setNewProcedureCode("");
    }
  };

  const removeProcedureCode = (code) => {
    setFormData(prev => ({
      ...prev,
      procedure_codes: prev.procedure_codes.filter(c => c !== code)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl sticky top-4">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-slate-900">
          {rule ? "עריכת כלל חוקיות" : "כלל חוקיות חדש"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rule_name" className="text-sm font-semibold text-slate-700">
              שם הכלל *
            </Label>
            <Input
              id="rule_name"
              value={formData.rule_name}
              onChange={(e) => handleChange("rule_name", e.target.value)}
              placeholder="לדוגמה: בדיקת צילום רנטגן עדכני"
              className="bg-white/80"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition" className="text-sm font-semibold text-slate-700">
              תנאי הכלל *
            </Label>
            <Textarea
              id="condition"
              value={formData.condition}
              onChange={(e) => handleChange("condition", e.target.value)}
              placeholder="תאר את התנאי שהכלל בודק..."
              className="bg-white/80 h-20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                פעולה *
              </Label>
              <Select value={formData.action} onValueChange={(value) => handleChange("action", value)}>
                <SelectTrigger className="bg-white/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">אישור אוטומטי</SelectItem>
                  <SelectItem value="require_review">דרוש אישור</SelectItem>
                  <SelectItem value="reject">דחייה אוטומטית</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                חומרה *
              </Label>
              <Select value={formData.severity} onValueChange={(value) => handleChange("severity", value)}>
                <SelectTrigger className="bg-white/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">נמוכה</SelectItem>
                  <SelectItem value="medium">בינונית</SelectItem>
                  <SelectItem value="high">גבוהה</SelectItem>
                  <SelectItem value="critical">קריטית</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">
              קודי פרוצדורה
            </Label>
            <div className="flex gap-2">
              <Input
                value={newProcedureCode}
                onChange={(e) => setNewProcedureCode(e.target.value)}
                placeholder="הוסף קוד פרוצדורה"
                className="bg-white/80"
              />
              <Button
                type="button"
                onClick={addProcedureCode}
                size="icon"
                variant="outline"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {formData.procedure_codes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.procedure_codes.map((code) => (
                  <Badge
                    key={code}
                    variant="outline"
                    className="gap-1 bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {code}
                    <button
                      type="button"
                      onClick={() => removeProcedureCode(code)}
                      className="ml-1 hover:bg-blue-200 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-slate-700">
              תיאור נוסף
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="תיאור מפורט של הכלל..."
              className="bg-white/80 h-16"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 gap-2"
            >
              <Save className="w-4 h-4" />
              שמור כלל
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              ביטול
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}