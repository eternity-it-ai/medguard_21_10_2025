from pymongo import MongoClient
from os import environ
from dotenv import load_dotenv

load_dotenv()
from interfaces import AuditRequest
from datetime import datetime, timedelta
# asdasdasdd
client = MongoClient(environ.get("MONGODB_URI"), tls=False, serverSelectionTimeoutMS=2000)
db = client[environ.get("DB_NAME", "test")]


class MongoCollections:
    def __init__(self, db):
        self.procedures = db["procedures"]

    def set_procedure_data(self, procedure_data: AuditRequest, evaluation_result):
        update_data = {
            "doctor_name": procedure_data.doctor_name,
            "execution_date": procedure_data.execution_date,
            "notes": procedure_data.notes,
            "patient_id": procedure_data.patient_id,
            "procedure_code": procedure_data.procedure_code,
            "procedure_name": procedure_data.procedure_name,
            "xray_url": procedure_data.xray_url,
            "evaluation_result": evaluation_result,
            "created_at": datetime.utcnow()
        }
        return self.procedures.insert_one(update_data)

    def get_statistics(self):
        from datetime import timedelta, datetime

        last_week = datetime.utcnow() - timedelta(days=7)

        total = self.procedures.count_documents({})
        approved = self.procedures.count_documents({"evaluation_result.approval_status": "מאושר"})
        needs_review = self.procedures.count_documents({"evaluation_result.approval_status": {"$regex": "בדיקה"}})
        rejected = self.procedures.count_documents({"evaluation_result.approval_status": "נדחו"})

        recent_procedures = self.procedures.count_documents({"created_at": {"$gte": last_week}})

        risk_stats = list(self.procedures.aggregate([
            {"$group": {"_id": "$evaluation_result.ai_analysis.risk_level", "count": {"$sum": 1}}}
        ]))

        doctor_stats = list(self.procedures.aggregate([
            {"$group": {"_id": "$doctor_name", "count": {"$sum": 1}}}
        ]))

        justified = self.procedures.count_documents({"evaluation_result.ai_analysis.medical_justification": True})
        contraindicated = self.procedures.count_documents({"evaluation_result.ai_analysis.contraindications": True})

        return {
            "total": total,
            "approved": approved,
            "needs_review": needs_review,
            "rejected": rejected,
            "last_7_days": recent_procedures,
            "risk_levels": risk_stats,
            "by_doctor": doctor_stats,
            "medical_justifications": justified,
            "contraindications": contraindicated
        }

    def filter_procedures(self, filters):

        query = {
            "evaluation_result": {"$exists": True}
        }

        if filters.get("doctorName"):
            query["doctor_name"] = {"$regex": filters["doctorName"], "$options": "i"}

        if filters.get("procedureCode"):
            query["procedure_code"] = {"$regex": filters["procedureCode"], "$options": "i"}

        if filters.get("status") and filters["status"] not in ("כל הסטטוסים", "all"):
            query["evaluation_result.approval_status"] = filters["status"]

        if filters.get("dateFrom"):
            query["execution_date"] = {"$regex": filters["dateFrom"]}

        return [
            {**doc, "created_at": doc["created_at"].isoformat()}
            for doc in self.procedures.find(query, {"_id": 0})
        ]


mongo = MongoCollections(db)
