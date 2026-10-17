from typing import List, Tuple
from app.models.document import Chunk

class ConfidenceScorer:
    def __init__(self, workspace_threshold: float = 0.65):
        self.workspace_threshold = workspace_threshold

    def calculate_confidence(
        self, 
        retrieved_chunks: List[Tuple[Chunk, float]], 
        citations: List[int],
        answer_text: str
    ) -> Tuple[float, str, bool]:
        """
        Calculates a final confidence score, tier (high/medium/low), and whether 
        the question was truly 'answered' vs falling back to 'I don't know'.
        
        Critical domain rule: If the LLM generates an answer but provides NO valid citations,
        it is automatically downgraded to LOW confidence regardless of retrieval scores.
        """
        # If the LLM explicitly refused to answer
        if "I don't have enough information" in answer_text:
            return 0.0, "low", False
            
        # If no chunks were retrieved, it's impossible to be confident
        if not retrieved_chunks:
            return 0.0, "low", False
            
        # If LLM answered but didn't cite anything, it might be hallucinating
        # from general knowledge instead of grounding.
        if not citations:
            return 0.1, "low", True
            
        # Calculate base score from the average similarity of CITED chunks
        cited_similarities = []
        for citation_idx in citations:
            # Check bounds (1-indexed)
            if 1 <= citation_idx <= len(retrieved_chunks):
                _, similarity = retrieved_chunks[citation_idx - 1]
                cited_similarities.append(similarity)
                
        if not cited_similarities:
            # Citations were hallucinated numbers
            return 0.1, "low", True
            
        avg_score = sum(cited_similarities) / len(cited_similarities)
        
        # Determine tier
        if avg_score >= self.workspace_threshold + 0.15:
            tier = "high"
        elif avg_score >= self.workspace_threshold:
            tier = "medium"
        else:
            tier = "low"
            
        return avg_score, tier, True
