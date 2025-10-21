import React, { useState } from "react";
// import { createMedicalProcedure } from "@/api/medicalProcedure";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, AlertTriangle, Loader2, Brain } from "lucide-react";

import ProcedureForm from "../components/procedure/ProcedureForm";
import XRayUpload from "../components/procedure/XRayUpload";
import AnalysisResults from "../components/procedure/AnalysisResults";
import { fetchStats } from "../api/Stats";

export default function ProcedureCheck() {
  const [formData, setFormData] = useState({
    patient_id: "",
    procedure_code: "",
    procedure_name: "",
    doctor_name: "",
    execution_date: "",
    notes: "",
  });

  const [xrayFile, setXrayFile] = useState(null);
  const [xrayUrl, setXrayUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const resetForm = () => {
    setFormData({
      patient_id: "",
      procedure_code: "",
      procedure_name: "",
      doctor_name: "",
      execution_date: "",
      notes: "",
    });
    setXrayFile(null);
    setXrayUrl(null);
    setAnalysisResults(null);
    setError(null);
    setIsLocked(false);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleXrayUpload = async (file) => {
    try {
      setXrayFile(file);
      const response = await fetch(`${API_URL}/upload_image/`, {
        method: "POST",
        body: (() => {
          const formData = new FormData();
          formData.append("file", file);
          return formData;
        })(),
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { file_url } = await response.json();
      setXrayUrl(file_url);
      setError(null);
    } catch (error) {
      console.error("שגיאה בהעלאת הקובץ:", error);
      setError("שגיאה בהעלאת הקובץ. אנא נסה שוב.");
    }
  };

  const analyzeProcedure = async () => {
    if (!formData.patient_id || !xrayUrl) {
      setError("אנא מלא מזהה מטופל והעלה צילום רנטגן");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/audit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          xray_url: xrayUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("שגיאה בתשובת השרת");
      }

      const aiAnalysis = await response.json();

      // Build results based on new API structure
      // Ensure findings and recommendations exist in ai_analysis
      const ai_analysis = {
        ...aiAnalysis.evaluation_result.ai_analysis,
        findings: aiAnalysis.evaluation_result.ai_analysis.findings ?? "",
        recommendations:
          aiAnalysis.evaluation_result.ai_analysis.recommendations ?? "",
      };
      const results = {
        ai_analysis,
        compliance_status: (() => {
          if (aiAnalysis.evaluation_result.approval_status === "מאושר")
            return "approved";
          if (aiAnalysis.evaluation_result.approval_status === "נדחה")
            return "rejected";
          if (
            aiAnalysis.evaluation_result.approval_status === "דרוש בדיקה נוספת"
          )
            return "requires_review";
          return "unknown";
        })(),
        compliance_notes:
          aiAnalysis.evaluation_result.ai_analysis.medical_justification,
        relevant_rules: 7, // placeholder: update if server returns real value
      };

      setAnalysisResults(results);
      setIsLocked(true);
      try {
        const stats = await fetchStats();
        console.log("Updated stats after procedure:", stats);
      } catch (e) {
        console.error("Failed to fetch stats after procedure:", e);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setError("שגיאה בניתוח הפרוצדורה. אנא נסה שוב.");
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                בדיקת פרוצדורה רפואית
              </h1>
              <p className="text-slate-600 mt-1">
                בדיקה מיידית של פרוצדורות מתוכננות עם ניתוח AI
              </p>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ProcedureForm
              formData={formData}
              onChange={handleFormChange}
              disabled={isLocked}
            />

            <XRayUpload
              onFileUpload={handleXrayUpload}
              uploadedFile={xrayFile}
              previewUrl={xrayUrl}
              disabled={isLocked}
            />

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
              <CardContent className="p-6">
                <Button
                  onClick={analyzeProcedure}
                  disabled={
                    isAnalyzing || !formData.patient_id || !xrayUrl || isLocked
                  }
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg h-14 text-lg font-semibold"
                >
                  {isLocked ? (
                    <>
                      <Brain className="w-5 h-5 mr-3" />
                      פרוצדורה נבדקה
                    </>
                  ) : isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      מנתח פרוצדורה...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-3" />
                      בדוק פרוצדורה
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            {analysisResults && (
              <>
                <AnalysisResults results={analysisResults} />
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="w-full"
                  >
                    בדיקת פרוצדורה חדשה
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
