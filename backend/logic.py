# Utility function to save uploaded files
import os
from fastapi import UploadFile
import aiofiles
from re import sub
from json import loads
from models import gemini_model
from PIL import Image
from pdf2image import convert_from_bytes
from prompts import PROMPT_TEMPLATE
from io import BytesIO
from interfaces import AuditRequest


async def save_uploaded_file(file: UploadFile, save_dir: str = "uploaded") -> str:
    """
    Save an uploaded file to the specified directory.

    Args:
        file (UploadFile): The uploaded file from FastAPI endpoint.
        save_dir (str): The directory where the file should be saved.

    Returns:
        str: The path to the saved file.
    """
    os.makedirs(save_dir, exist_ok=True)
    file_path = os.path.join(save_dir, file.filename)
    async with aiofiles.open(file_path, "wb") as buffer:
        content = await file.read()
        await buffer.write(content)
    return file.filename


def extract_text_from_image_gemini(contents: AuditRequest) -> dict:
    try:
        xray_url = contents.xray_url
        file_bytes = load_file_binary_from_uploaded(xray_url)
        file = None

        if xray_url.endswith('.pdf'):
            images = convert_from_bytes(file_bytes)
            if images:
                file = images[0]
        elif xray_url.endswith(('.png', '.jpg', '.jpeg')):
            try:
                file = Image.open(BytesIO(file_bytes))
            except Exception as e:
                print(f"❌ Failed to open image file: {e}")
                return {"error": "Invalid or corrupted image file."}
        
        if file is None:
            print(f"❌ Unsupported file type or PDF with no images: {xray_url}")
            return {"error": "Unsupported file type or PDF with no images."}

        prompt = PROMPT_TEMPLATE.format(
            procedure_code=contents.procedure_code,
            procedure_name=contents.procedure_name,
            doctor_name=contents.doctor_name,
            execution_date=contents.execution_date,
            notes=contents.notes,
            image_base64=file
        )
        response = gemini_model.generate_content(prompt)
        raw = response.text.strip()
        if raw.startswith("```json"):
            raw = raw.removeprefix("```json").removesuffix("```").strip()
        try:
            parsed = loads(raw)
            return parsed
        except Exception as err:
            print(f"❌ Failed to parse Gemini response: {err}")
            # Return a structured error if parsing fails
            return {"error": "Failed to parse AI response."}
    except Exception as err:
        print(f"❌ An unexpected error occurred: {err}")
        return {"error": "An unexpected error occurred during processing."}


def process(contents: AuditRequest) -> dict:
    res = extract_text_from_image_gemini(contents)
    return res


def load_file_binary_from_uploaded(filename: str) -> bytes:
    """
    Load and return the binary content of a file located in the 'uploaded' directory.

    Args:
        filename (str): The name of the file inside the 'uploaded' directory.

    Returns:
        bytes: The binary content of the file.
    """
    file_path = os.path.join("uploaded", filename)
    with open(file_path, "rb") as f:
        return f.read()
