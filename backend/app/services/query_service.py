import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.rag.embedder import Embedder
from app.rag.retriever import Retriever
from app.rag.generator import Generator
from app.rag.confidence_scorer import ConfidenceScorer
from app.models.query import Query, Citation
from app.models.workspace import Workspace

class QueryService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.embedder = Embedder()
        self.retriever = Retriever(session, self.embedder)
        self.generator = Generator()
        
    async def ask_question(self, question: str, workspace_id: uuid.UUID, user_id: uuid.UUID, document_set_id: uuid.UUID = None) -> dict:
        """
        Orchestrates the entire RAG pipeline and persists the result.
        """
        # Fetch workspace threshold
        workspace = await self.session.get(Workspace, workspace_id)
        threshold = float(workspace.confidence_threshold) if workspace else 0.65
        
        scorer = ConfidenceScorer(workspace_threshold=threshold)
        
        # 1. Retrieve
        retrieved_chunks = await self.retriever.retrieve_relevant_chunks(
            question=question,
            workspace_id=str(workspace_id),
            document_set_id=str(document_set_id) if document_set_id else None,
            threshold=threshold
        )
        
        # 2. Generate
        gen_result = await self.generator.generate_answer(question, retrieved_chunks)
        answer_text = gen_result["text"]
        citations_idx = gen_result["citations"]
        
        # 3. Score Confidence
        score, tier, answered = scorer.calculate_confidence(
            retrieved_chunks, citations_idx, answer_text
        )
        
        # 4. Save Query Audit Log
        query_record = Query(
            workspace_id=workspace_id,
            user_id=user_id,
            question_text=question,
            answer_text=answer_text if answered else None,
            confidence_score=score,
            confidence_tier=tier,
            answered=answered
        )
        self.session.add(query_record)
        await self.session.flush() # get ID
        
        # 5. Save Citations
        saved_citations = []
        for idx in citations_idx:
            if 1 <= idx <= len(retrieved_chunks):
                chunk, similarity = retrieved_chunks[idx - 1]
                cit = Citation(
                    query_id=query_record.id,
                    chunk_id=chunk.id,
                    relevance_score=similarity
                )
                self.session.add(cit)
                saved_citations.append({
                    "document_id": str(chunk.document_id),
                    "chunk_id": str(chunk.id),
                    "text": chunk.content,
                    "relevance": similarity
                })
                
        await self.session.commit()
        
        return {
            "query_id": str(query_record.id),
            "answer": answer_text,
            "confidence_tier": tier,
            "citations": saved_citations
        }
