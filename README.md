# InsightDesk AI
**Every answer, grounded. Every claim, cited.**

![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

InsightDesk AI is a retrieval-augmented knowledge and support assistant that answers questions and drafts ticket replies strictly from a company's own documents — always with citations, always with a human approving anything sent to a real customer.

## Live Demo
> **Note on Token-Budget:** The live demo uses a budget-capped LLM API for cost control. If you receive a "temporarily unavailable" error, the daily budget has been reached. In that case, you can run the project locally using the Mocked LLM mode (see Getting Started).

[Link to Live Demo (Placeholder)]()
* Demo Agent Login: `agent@insightdesk.local`
* Demo Admin Login: `admin@insightdesk.local`

## The Problem
Support and operations teams answer the same questions dozens of times a day. The knowledge to answer them exists somewhere, but generic LLM chatbots "solve" this by hallucinating plausible-sounding but unverified answers, which is actively dangerous for policy/pricing questions. InsightDesk gives the speed of an AI assistant without the risk of an ungrounded one.

**Amman Job Market Context:** This project directly addresses the growing demand for "AI/LLM Integration" roles in Jordan by demonstrating applied AI engineering (retrieval design, grounding, hallucination mitigation), rather than just calling a chat API.

## Screenshots
*(Add screenshots here)*
1. Ask view with a cited answer.
2. Documents admin screen.
3. Confidence-distribution chart.

## Architecture
This project uses a modern, separated architecture ensuring that the AI generation is decoupled from storage and retrieval.

![Architecture Diagram](docs/architecture-diagram.png)

## Tech Stack
| Component | Technology | Justification |
|-----------|------------|---------------|
| Backend | FastAPI (Python 3.12) | Best-in-class async support, perfect for IO-bound LLM tasks. |
| Database | PostgreSQL + pgvector | Operational simplicity for MVP while offering robust vector similarity search. |
| Background | Celery + Redis | Offloads heavy document ingestion/embedding from the main API thread. |
| Frontend | React 18 + TS + Tailwind | Modern, fast, and highly customizable UI with shadcn/ui. |

## Features
* **Document Ingestion:** Upload policies; system automatically chunks and embeds them.
* **Grounded Q&A:** Answers are constructed *only* from retrieved context.
* **Citations:** Every claim is linked back to the exact source passage.
* **Confidence Scoring:** Answers below a confidence threshold are explicitly flagged or refused.
* **Human-Approval Workflow:** Ticket drafts are never auto-sent.
* **Audit Logging:** Every query, retrieval, and generation is logged.

## Getting Started
To run the full stack locally without needing your own OpenAI keys (using the mocked-LLM mode):

```bash
docker compose up
```

## Environment Setup
See `.env.example` for required environment variables if you wish to run with real LLM keys.

## API Documentation
Once running, visit `http://localhost:8000/docs` for the Swagger UI.
Example query:
```bash
curl -X POST http://localhost:8000/api/v1/query \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the refund policy?", "documentSetId": "123"}'
```

## Database Schema
[Link to ERD (Placeholder)]()
*Note on pgvector:* We use PostgreSQL's `pgvector` extension rather than a dedicated vector DB (like Pinecone) to maintain transactional consistency between document metadata and chunks at this scale.

## The RAG Pipeline, Explained
1. **Embed:** The user's question is embedded using the embedding model.
2. **Retrieve:** `pgvector` performs a cosine-similarity search to find the top-K relevant document chunks.
3. **Generate:** The retrieved chunks and the question are injected into a strict system prompt.
4. **Score & Extract:** The model generates an answer with citations. The system extracts the citations and verifies they map to the provided chunks. If no valid citations exist, the answer is discarded.

## Responsible AI Design
InsightDesk is built with safety-first AI principles:
* **Grounding:** The prompt strictly forbids answering from general knowledge.
* **Citation Enforcement:** A code-level rule prevents any confident answer from returning without a valid citation.
* **Confidence Scoring:** Answers are bucketed (High/Medium/Low) for user visibility.
* **Human Approval:** Drafts require explicit agent action.
* **Prompt-Injection Mitigation:** Retrieved context is heavily delimited, and uploads are restricted to Admins.

## Testing
Run the test suite using `pytest`. 
**Highlight:** The project includes a dedicated *prompt-injection test suite* (`tests/security/`) that verifies the system safely ignores malicious instructions embedded inside uploaded documents.

## Security
* JWT-based auth with Role-Based Access Control (RBAC).
* Document-set scoped queries (Tenancy isolation at the retrieval level).
* Sanitized Markdown rendering on the frontend.

## Deployment
Configured for deployment on Google Cloud Platform (Cloud Run, Cloud SQL, Memorystore).

## Roadmap
See `docs/roadmap.md` for future features (Multilingual support, Helpdesk webhooks).

## License
MIT License
