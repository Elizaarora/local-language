from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from typing import List
import aiofiles
import os
from datetime import datetime
from ..core.logging_config import logger
import uuid

router = APIRouter(prefix="/files", tags=["Files"])

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
ALLOWED_FILE_TYPES = {
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "application/pdf", "text/plain", "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a file (image or document)"""
    try:
        # Validate file type
        if file.content_type not in ALLOWED_FILE_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"File type {file.content_type} not allowed. Allowed types: {', '.join(ALLOWED_FILE_TYPES)}"
            )
        
        # Read file content
        content = await file.read()
        
        # Validate file size
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds maximum allowed size of {MAX_FILE_SIZE / (1024*1024)}MB"
            )
        
        # Generate unique filename
        file_ext = os.path.splitext(file.filename)[1] if file.filename else ".bin"
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)
        
        # Generate URL (in production, use CDN or cloud storage)
        file_url = f"/files/{unique_filename}"
        
        logger.info(f"File uploaded: {file.filename} -> {unique_filename}")
        
        return {
            "filename": unique_filename,
            "original_filename": file.filename,
            "url": file_url,
            "content_type": file.content_type,
            "size": len(content),
            "uploaded_at": datetime.utcnow().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"File upload error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to upload file")

@router.get("/{filename:path}")
async def get_file(filename: str):
    """Get uploaded file"""
    # Handle avatar files
    if filename.startswith("avatars/"):
        file_path = os.path.join("uploads", filename)
    else:
        file_path = os.path.join(UPLOAD_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    from fastapi.responses import FileResponse
    return FileResponse(file_path)

@router.delete("/{filename}")
async def delete_file(filename: str):
    """Delete uploaded file"""
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        os.remove(file_path)
        logger.info(f"File deleted: {filename}")
        return {"status": "success", "message": "File deleted successfully"}
    except Exception as e:
        logger.error(f"File deletion error: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete file")

