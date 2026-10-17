import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.document import Document, Chunk
from app.rag.embedder import Embedder

class Chunker:
    """
    Splits text into smaller chunks. 
    In a real system, this uses semantic chunking (e.g. LangChain recursive text splitter).
    """
    def split_text(self, text: str, chunk_size: int = 500) -> list[str]:
        # Simplistic split for MVP demonstration
        words = text.split()
        chunks = []
        for i in range(0, len(words), chunk_size):
            chunks.append(" ".join(words[i:i + chunk_size]))
        return chunks

class IngestionService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.embedder = Embedder()
        self.chunker = Chunker()
        
    async def process_document(self, document_id: uuid.UUID, text_content: str):
        """
        Async worker job to chunk, embed, and index a document.
        """
        document = await self.session.get(Document, document_id)
        if not document:
            return
            
        try:
            document.status = "processing"
            await self.session.commit()
            
            # 1. Chunk
            text_chunks = self.chunker.split_text(text_content)
            
            # 2. Embed
            embeddings = await self.embedder.embed_chunks(text_chunks)
            
            # 3. Store in pgvector
            for idx, (text, vector) in enumerate(zip(text_chunks, embeddings)):
                chunk = Chunk(
                    document_id=document.id,
                    content=text,
                    embedding=vector,
                    chunk_index=idx,
                    active=True
                )
                self.session.add(chunk)
                
            document.status = "indexed"
            await self.session.commit()
            
        except Exception as e:
            document.status = "failed"
            document.failure_reason = str(e)
            await self.session.commit()
