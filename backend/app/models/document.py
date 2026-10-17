from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, func
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector
import uuid
from app.core.database import Base

class DocumentSet(Base):
    __tablename__ = "document_sets"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    purpose = Column(String(30), nullable=False) # support, internal

class Document(Base):
    __tablename__ = "documents"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_set_id = Column(UUID(as_uuid=True), ForeignKey("document_sets.id"), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    source_file_ref = Column(String(500), nullable=False)
    version = Column(Integer, default=1)
    status = Column(String(20), nullable=False) # processing, indexed, failed
    failure_reason = Column(Text, nullable=True)
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Chunk(Base):
    __tablename__ = "chunks"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"), nullable=False, index=True)
    content = Column(Text, nullable=False)
    # Using OpenAI embeddings default dimension (1536)
    embedding = Column(Vector(1536), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    active = Column(Boolean, default=True) # Used instead of hard delete for old versions
