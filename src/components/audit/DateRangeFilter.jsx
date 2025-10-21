import React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Filter, Play, Loader2} from "lucide-react";

export default function DateRangeFilter({
                                            filters, onFiltersChange
                                        }) {
    const API_URL = import.meta.env.VITE_API_URL;

    const handleFilterChange = (field, value) => {
        onFiltersChange(prev => ({...prev, [field]: value}));
    };

    const submitFilters = async () => {
        const payload = {
            dateFrom: filters.dateFrom,
            dateTo: filters.dateTo,
            doctorName: filters.doctorName,
            procedureCode: filters.procedureCode,
            status: filters.status
        };

        try {
            const response = await fetch(`${API_URL}/procedures/filter`, {
                method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Server error");
            }

            const result = await response.json();
            console.log("Filtered procedures:", result);
            onFiltersChange(prev => ({
                ...prev,
                procedures: [...result].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            }));
        } catch (error) {
            console.error("Error submitting filters:", error);
        }
    };

    return (<div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg text-slate-900">
                    <Filter className="w-5 h-5 text-blue-600"/>
                    סינון פרוצדורות
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="dateFrom" className="text-sm font-semibold text-slate-700">
                        מתאריך
                    </Label>
                    <Input
                        id="dateFrom"
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                        className="bg-white/80 border-slate-200"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="dateTo" className="text-sm font-semibold text-slate-700">
                        עד תאריך
                    </Label>
                    <Input
                        id="dateTo"
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                        className="bg-white/80 border-slate-200"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="doctorName" className="text-sm font-semibold text-slate-700">
                        רופא
                    </Label>
                    <Input
                        id="doctorName"
                        value={filters.doctorName}
                        onChange={(e) => handleFilterChange("doctorName", e.target.value)}
                        placeholder="שם הרופא"
                        className="bg-white/80 border-slate-200"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="procedureCode" className="text-sm font-semibold text-slate-700">
                        קוד פרוצדורה
                    </Label>
                    <Input
                        id="procedureCode"
                        value={filters.procedureCode}
                        onChange={(e) => handleFilterChange("procedureCode", e.target.value)}
                        placeholder="קוד"
                        className="bg-white/80 border-slate-200"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">
                        סטטוס
                    </Label>
                    <div className="relative">
                        <Select value={filters.status}
                                onValueChange={(value) => handleFilterChange("status", value)}>
                            <SelectTrigger className="bg-white/80 border-slate-200">
                                <SelectValue placeholder="בחר סטטוס"/>
                            </SelectTrigger>
                            <SelectContent
                                className="z-50 bg-white shadow-lg border border-slate-200">
                                <SelectItem value="all">כל הסטטוסים</SelectItem>
                                <SelectItem value="מאושר">מאושר</SelectItem>
                                <SelectItem value="דרוש בדיקה נוספת">דרוש בדיקה נוספת</SelectItem>
                                <SelectItem value="נדחה">נדחה</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
            <CardContent className="p-4">
                <Button
                    onClick={submitFilters}
                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                >
                    <Play className="w-4 h-4"/>

                    שלח בקשה עם סינון
                </Button>
                <p className="text-xs text-slate-500 mt-2 text-center">
                    יבוצע ניתוח AI לכל הפרוצדורות המסוננות
                </p>
            </CardContent>
        </Card>
    </div>);
}