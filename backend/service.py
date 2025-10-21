from fastapi import APIRouter, UploadFile, HTTPException, Request
from fastapi.responses import FileResponse
from logic import save_uploaded_file
import os
from db import mongo
from interfaces import AuditRequest
from logic import process

router = APIRouter()


@router.get("/health")
async def health_check():
    return {"status":"Alive"}

@router.post("/upload_image/")
async def upload_image(file: UploadFile):
    try:
        filename = await save_uploaded_file(file)
        return {"file_url": filename}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/uploaded/{filename}")
async def get_uploaded_image(filename: str):
    file_path = os.path.join("uploaded", filename)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, media_type="image/*")


@router.post("/audit")
async def audit_procedure(data: AuditRequest):
    # This is a placeholder for auditing logic
    # For now, just return the received data to confirm it was received correctly
    evaluation_result = process(data)
    # res = mongo.set_procedure_data(data, evaluation_result)
    return {
        "message": "Audit received",
        "inserted": "ASdasd",
        "procedure_code": data.procedure_code,
        "procedure_name": data.procedure_name,
        "xray_url": data.xray_url,
        "evaluation_result": evaluation_result
    }


# Statistics endpoint
@router.get("/stats")
def get_statistics():
    return mongo.get_statistics()


@router.get("/download_image/{filename}")
async def download_image(filename: str):
    file_path = os.path.join("uploaded", filename)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, media_type="application/octet-stream", filename=filename)


# Filtering procedures endpoint
@router.post("/procedures/filter")
async def filter_procedures(request: Request):
    filters = await request.json()
    results = mongo.filter_procedures(filters)
    return results
