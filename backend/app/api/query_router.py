from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
import uuid

from app.core.database import get_db
from app.services.query_service import QueryService

router = APIRouter(prefix="/api/v1", tags=["query"])

class AskRequest(BaseModel):
    question: str
    document_set_id: str | None = None
    # For a real app, user_id and workspace_id come from the JWT auth token
    user_id: str
    workspace_id: str

@router.post("/query")
async def ask_question(request: AskRequest, db: AsyncSession = Depends(get_db)):
    """
    Ask a grounded question. 
    In the real implementation this uses SSE (Server-Sent Events) for streaming tokens.
    For this initial MVP structure, it returns the JSON payload.
    """
    try:
        service = QueryService(db)
        result = await service.ask_question(
            question=request.question,
            workspace_id=uuid.UUID(request.workspace_id),
            user_id=uuid.UUID(request.user_id),
            document_set_id=uuid.UUID(request.document_set_id) if request.document_set_id else None
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
