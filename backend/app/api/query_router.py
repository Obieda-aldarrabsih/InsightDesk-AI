from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, Field
import uuid

from app.core.database import get_db
from app.services.query_service import QueryService

router = APIRouter(prefix="/api/v1", tags=["query"])

class AskRequest(BaseModel):
    question: str
    document_set_id: str | None = Field(default=None, alias="documentSetId")
    user_id: str = "00000000-0000-0000-0000-000000000001"
    workspace_id: str = "00000000-0000-0000-0000-000000000001"

    model_config = {
        "populate_by_name": True
    }

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
