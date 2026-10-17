import re
from typing import List, Tuple
from app.models.document import Chunk
from app.rag.prompt_builder import PromptBuilder

class Generator:
    def __init__(self, provider: str = "mock"):
        self.provider = provider
        self.prompt_builder = PromptBuilder()

    async def generate_answer(self, question: str, retrieved_chunks: List[Tuple[Chunk, float]]) -> dict:
        """
        Calls the LLM to generate an answer. Returns the text and any extracted citations.
        Mocked for local dev to avoid API costs.
        """
        prompt = self.prompt_builder.build_prompt(question, retrieved_chunks)
        
        if self.provider == "mock":
            # Deterministic mock response for portfolio testing
            if not retrieved_chunks:
                return {
                    "text": "I don't have enough information to answer this confidently.",
                    "citations": []
                }
            
            # Simulate a successful grounded answer referencing the first chunk
            # The test suites and demo will use this predictable behavior
            answer_text = f"Based on the provided documentation, the answer is here. [1]"
            citations = [1]
            
            return {
                "text": answer_text,
                "citations": citations
            }
            
        raise NotImplementedError("Real LLM provider not yet configured")
        
    def extract_citations(self, text: str) -> List[int]:
        """
        Finds citation markers like [1] or [2] in the text.
        """
        # Finds digits inside brackets
        matches = re.findall(r'\[(\d+)\]', text)
        return list(set(int(m) for m in matches))
