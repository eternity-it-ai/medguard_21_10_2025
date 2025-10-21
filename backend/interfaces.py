from pydantic import BaseModel
from typing import Optional

class AuditRequest(BaseModel):
    procedure_code: str
    procedure_name: str
    execution_date: Optional[str] = None
    patient_id: Optional[str] = None
    doctor_name: Optional[str] = None
    notes: Optional[str] = None
    xray_url: Optional[str] = None