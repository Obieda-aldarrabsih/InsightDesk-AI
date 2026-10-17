from typing import List

class Embedder:
    """
    Interface for embedding text into vector space.
    """
    def __init__(self, provider: str = "mock"):
        self.provider = provider
        
    async def embed_text(self, text: str) -> List[float]:
        """
        Embeds a single string into a vector.
        Uses a mocked deterministic response for local dev without API keys.
        """
        if self.provider == "mock":
            # Return a deterministic mock vector of dimension 1536
            # In a real app, this calls OpenAI or another provider
            return [0.01 * (i % 10) for i in range(1536)]
            
        raise NotImplementedError("Real embedding provider not yet configured")
        
    async def embed_chunks(self, chunks: List[str]) -> List[List[float]]:
        return [await self.embed_text(c) for c in chunks]
