from sqlalchemy import Column, String, Integer, Numeric, Boolean, DateTime, ForeignKey, Text, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.core.database import Base

class Query(Base):
    __tablename__ = "queries"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    answer_text = Column(Text, nullable=True)
    confidence_score = Column(Numeric(4, 3), nullable=False)
    confidence_tier = Column(String(10), nullable=False) # high, medium, low
    answered = Column(Boolean, nullable=False) # false if explicitly "I don't know"
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

class Citation(Base):
    __tablename__ = "citations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    query_id = Column(UUID(as_uuid=True), ForeignKey("queries.id"), nullable=False)
    chunk_id = Column(UUID(as_uuid=True), ForeignKey("chunks.id"), nullable=False)
    relevance_score = Column(Numeric(4, 3), nullable=False)

class Draft(Base):
    __tablename__ = "drafts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    query_id = Column(UUID(as_uuid=True), ForeignKey("queries.id"), nullable=False)
    ticket_ref = Column(String(100), nullable=True)
    draft_text = Column(Text, nullable=False)
    final_text = Column(Text, nullable=True)
    status = Column(String(20), nullable=False) # pending, approved_sent, rejected, escalated
    edited_distance = Column(Integer, nullable=True)
    decided_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    decided_at = Column(DateTime(timezone=True), nullable=True)
