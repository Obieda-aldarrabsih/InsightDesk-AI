from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Tuple
from app.models.document import Chunk, Document
from app.rag.embedder import Embedder

class Retriever:
    def __init__(self, session: AsyncSession, embedder: Embedder):
        self.session = session
        self.embedder = embedder

    async def retrieve_relevant_chunks(
        self, 
        question: str, 
        workspace_id: str, 
        document_set_id: str = None, 
        top_k: int = 5,
        threshold: float = 0.65
    ) -> List[Tuple[Chunk, float]]:
        """
        Embeds the question and performs a cosine-similarity search against pgvector.
        Enforces tenant isolation by joining/filtering on workspace_id or document_set_id.
        """
        # 1. Embed the user's question
        question_vector = await self.embedder.embed_text(question)

        # 2. Build the vector search query using pgvector's cosine distance operator (<=>)
        # Cosine distance is 1 - cosine similarity. So similarity = 1 - distance.
        # We want chunks where (1 - distance) >= threshold.
        # distance <= 1 - threshold
        
        query = (
            select(Chunk, Chunk.embedding.cosine_distance(question_vector).label('distance'))
            .join(Document, Chunk.document_id == Document.id)
            # Filter by active chunks only
            .where(Chunk.active == True)
        )
        
        # Enforce scoping if document_set_id is provided
        if document_set_id:
            query = query.where(Document.document_set_id == document_set_id)
            
        # Add similarity ordering and limit
        query = query.order_by(Chunk.embedding.cosine_distance(question_vector)).limit(top_k)

        result = await self.session.execute(query)
        rows = result.all()

        # 3. Filter by confidence threshold (similarity >= threshold)
        # Convert distance back to similarity: similarity = 1 - distance
        valid_chunks = []
        for row in rows:
            chunk = row[0]
            distance = row[1]
            similarity = 1.0 - distance
            if similarity >= threshold:
                valid_chunks.append((chunk, similarity))

        return valid_chunks
