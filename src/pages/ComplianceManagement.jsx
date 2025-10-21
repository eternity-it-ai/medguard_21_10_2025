import React, { useState, useEffect } from "react";
import ComplianceRule from "@/api/ComplianceRule";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Plus } from "lucide-react";

import RulesList from "../components/compliance/RulesList";
import RuleForm from "../components/compliance/RulesForm.jsx";

export default function ComplianceManagement() {
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    setIsLoading(true);
    try {
      const data = await ComplianceRule.list("-created_date");
      setRules(data);
      if (data && data.length > 0) {
        setSuccessMessage("החוקים נטענו בהצלחה");
      }
    } catch (error) {
      console.error("Error loading rules:", error);
    }
    setIsLoading(false);
  };

  const handleSaveRule = async (ruleData) => {
    try {
      if (editingRule) {
        await ComplianceRule.update(editingRule.id, ruleData);
      } else {
        await ComplianceRule.create(ruleData);
      }
      setShowForm(false);
      setEditingRule(null);
      loadRules();
    } catch (error) {
      console.error("Error saving rule:", error);
    }
  };

  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setShowForm(true);
  };

  const handleToggleRule = async (rule) => {
    try {
      await ComplianceRule.update(rule.id, { is_active: !rule.is_active });
      loadRules();
    } catch (error) {
      console.error("Error toggling rule:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">ניהול חוקיות</h1>
                <p className="text-slate-600 mt-1">הגדרה וניהול כללי חוקיות רפואית</p>
              </div>
            </div>

            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg gap-2"
            >
              <Plus className="w-4 h-4" />
              כלל חדש
            </Button>
          </div>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded">
            {successMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RulesList
              rules={rules}
              isLoading={isLoading}
              onEdit={handleEditRule}
              onToggle={handleToggleRule}
            />
          </div>

          {showForm && (
            <div className="lg:col-span-1">
              <RuleForm
                rule={editingRule}
                onSave={handleSaveRule}
                onCancel={() => {
                  setShowForm(false);
                  setEditingRule(null);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}