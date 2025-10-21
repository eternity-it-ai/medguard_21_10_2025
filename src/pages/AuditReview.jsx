import React, {useState, useEffect} from "react";
import {MedicalProcedure} from "@/api/MedicalProcedure";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {
    FileCheck,
    Search,
    Calendar,
    Filter,
    Play,
    Loader2,
    AlertTriangle,
    CheckCircle,
    XCircle
} from "lucide-react";

import DateRangeFilter from "../components/audit/DateRangeFilter";
import ProceduresList from "../components/audit/ProceduresList";
import AuditProgress from "../components/audit/AuditProgress";

export default function AuditReview() {
    const [procedures, setProcedures] = useState([]);
    const [filteredProcedures, setFilteredProcedures] = useState([]);
    const [filters, setFilters] = useState({
        dateFrom: "",
        dateTo: "",
        doctorName: "",
        procedureCode: "",
        status: "all"
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditProgress, setAuditProgress] = useState({current: 0, total: 0});

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        // Fetch procedures using POST request with empty JSON body
        const fetchProcedures = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/procedures/filter`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({})
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch procedures from /procedures/filter");
                }
                const data = await response.json();
                setProcedures(data);
            } catch (error) {
                console.error("Error loading procedures:", error);
            }
            setIsLoading(false);
        };
        fetchProcedures();
    }, []);

    useEffect(() => {
        applyFilters();
        getStatsCards();
    }, [procedures, filters]);

    const loadProcedures = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/procedures/filter`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({})
            });
            if (!response.ok) {
                throw new Error("Failed to fetch procedures from /procedures/filter");
            }
            const data = await response.json();
            setProcedures(data);
        } catch (error) {
            console.error("Error loading procedures:", error);
        }
        setIsLoading(false);
    };

    const applyFilters = () => {
        let filtered = [...procedures];

        if (filters.dateFrom) {
            filtered = filtered.filter(p => p.execution_date >= filters.dateFrom);
        }
        if (filters.dateTo) {
            filtered = filtered.filter(p => p.execution_date <= filters.dateTo);
        }
        if (filters.doctorName) {
            filtered = filtered.filter(p =>
                p.doctor_name?.toLowerCase().includes(filters.doctorName.toLowerCase())
            );
        }
        if (filters.procedureCode) {
            filtered = filtered.filter(p =>
                p.procedure_code?.toLowerCase().includes(filters.procedureCode.toLowerCase())
            );
        }
        if (filters.status !== "all") {
            filtered = filtered.filter(p => p.evaluation_result?.approval_status === filters.status);
        }

        setFilteredProcedures(filtered);
    };

    const runAuditReview = async () => {
        const proceduresToAudit = filteredProcedures.filter(p => p.xray_url);

        if (proceduresToAudit.length === 0) {
            alert("לא נמצאו פרוצדורות עם צילומי רנטגן לביקורת");
            return;
        }

        setIsAuditing(true);
        setAuditProgress({current: 0, total: proceduresToAudit.length});

        for (let i = 0; i < proceduresToAudit.length; i++) {
            const procedure = proceduresToAudit[i];

            try {
                const response = await fetch("/api/audit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        procedure_code: procedure.procedure_code,
                        procedure_name: procedure.procedure_name,
                        execution_date: procedure.execution_date,
                        xray_url: procedure.xray_url
                    })
                });

                if (!response.ok) {
                    throw new Error("Audit request failed");
                }

                const auditAnalysis = await response.json();

                // עדכון הפרוצדורה עם תוצאות הביקורת
                await MedicalProcedure.update(procedure.id, {
                    notes: `${procedure.notes || ""}\n\nביקורת רטרואקטיבית: ${JSON.stringify(auditAnalysis, null, 2)}`
                });

                setAuditProgress({current: i + 1, total: proceduresToAudit.length});

            } catch (error) {
                console.error(`Error auditing procedure ${procedure.id}:`, error);
            }
        }

        setIsAuditing(false);
        await loadProcedures(); // רענון הנתונים
    };

    const getStatsCards = () => {
        const total = procedures.length;
        const approved = procedures.filter(p => p.evaluation_result?.approval_status === "מאושר").length;
        const pending = procedures.filter(p => p.evaluation_result?.approval_status === "דרוש בדיקה נוספת").length;
        const rejected = procedures.filter(p => p.evaluation_result?.approval_status === "נדחה").length;
        return { total, approved, pending, rejected };
    };

    const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });

    useEffect(() => {
        const updatedStats = getStatsCards();
        setStats(updatedStats);
    }, [procedures]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                            <FileCheck className="w-6 h-6 text-white"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">ביקורת רטרואקטיבית</h1>
                            <p className="text-slate-600 mt-1">בדיקה וניתוח של פרוצדורות שבוצעו בעבר</p>
                        </div>
                    </div>
                </div>

                {/* כרטיסי סטטיסטיקה */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                            <div className="text-sm text-slate-600">סה"כ פרוצדורות</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                            <div className="text-sm text-slate-600">מאושרות</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
                            <div className="text-sm text-slate-600">בבדיקה</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                            <div className="text-sm text-slate-600">נדחו</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* פילטרים */}
                    <div className="lg:col-span-1">
                        <DateRangeFilter
                            filters={filters}
                            onFiltersChange={setFilters}
                            onRunAudit={runAuditReview}
                            isAuditing={isAuditing}
                            proceduresCount={filteredProcedures.filter(p => p.xray_url).length}
                        />

                        {isAuditing && (
                            <AuditProgress progress={auditProgress}/>
                        )}
                    </div>

                    {/* רשימת פרוצדורות */}
                    <div className="lg:col-span-3">
                        <ProceduresList
                            procedures={filteredProcedures}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}