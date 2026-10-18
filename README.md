# InsightDesk AI
> Every answer, grounded. Every claim, cited.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.142-brightgreen.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL + pgvector](https://img.shields.io/badge/PostgreSQL-pgvector-blue.svg)](https://github.com/pgvector/pgvector)
[![Celery](https://img.shields.io/badge/Celery-5.6-green.svg)](https://docs.celeryq.dev/)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)

InsightDesk AI is a retrieval-augmented knowledge and support assistant that answers operational and policy questions strictly from an organization's verified documents — always citing source passages, and always keeping a human agent in the loop before customer replies are dispatched.

---

## Visual Preview & Interface (Light & Dark Mode)

### Grounded AI Assistant with Inline Citations
| Light Mode | Dark Mode |
| :---: | :---: |
| ![Grounded AI Assistant Light](docs/screenshots/01-ask-assistant-light.png) | ![Grounded AI Assistant Dark](docs/screenshots/01-ask-assistant-dark.png) |

### Knowledge Base & Document Chunking Pipeline
| Light Mode | Dark Mode |
| :---: | :---: |
| ![Document Ingestion Light](docs/screenshots/02-document-ingestion-light.png) | ![Document Ingestion Dark](docs/screenshots/02-document-ingestion-dark.png) |

### LLM Thresholds & Retrieval Parameters
| Light Mode | Dark Mode |
| :---: | :---: |
| ![Settings Configuration Light](docs/screenshots/03-settings-config-light.png) | ![Settings Configuration Dark](docs/screenshots/03-settings-config-dark.png) |

---

## The Problem

Customer support and operations teams answer the same repetitive policy questions dozens of times a day. While general-purpose LLMs can draft text quickly, they frequently hallucinate plausible-sounding falsehoods on edge-case policy, shipping rates, or legal terms.

InsightDesk AI enforces strict deterministic grounding: **if retrieved document chunks do not surpass relevance thresholds, the system refuses to answer rather than speculating.**

---

## Architecture

InsightDesk AI separates ingestion, vector search, and generation into modular async pipelines:

```mermaid
graph TD
    subgraph "Clients"
        UI[Support Agent Portal - React]
    end

    subgraph "Application API"
        API[FastAPI Gateway - Port 8000]
        RAG[RAG Orchestrator & Scorer]
    end

    subgraph "Asynchronous Workers"
        CELERY[Celery Worker - Document Ingestion]
        REDIS[(Redis 7 - Broker & Cache)]
    end

    subgraph "Persistence"
        PG[(PostgreSQL 15 + pgvector)]
    end

    UI <-->|REST API| API
    API --> RAG
    API -->|Enqueue Ingestion| REDIS
    REDIS --> CELERY
    CELERY -->|Chunk & Embed| PG
    RAG <-->|Cosine Similarity Search| PG
```

---

## Tech Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Backend API** | FastAPI (Python 3.12), Pydantic v2 | High-performance asynchronous execution for I/O-bound retrieval and LLM operations. |
| **Vector Storage** | PostgreSQL 15 + `pgvector` | Unified transactional ACID store for both relational metadata and dense vector embeddings. |
| **Background Processing** | Celery 5.6, Redis 7 | Offloads multi-page document chunking and vector embedding generation from the HTTP request thread. |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Vite | Responsive dashboard for support agents and knowledge managers. |
| **Testing** | Pytest, Pytest-Asyncio | Automated coverage for confidence tiering and prompt-injection safety suites. |
| **Containerization** | Docker, Docker Compose | Complete local multi-container stack (`db`, `redis`, `api`, `worker`, `frontend`). |

---

## Features

- **Grounded Q&A**: Answers are constructed exclusively from retrieved context chunks.
- **Below-Threshold Guard**: When vector similarity search yields no chunks above the workspace confidence threshold, generation is bypassed immediately to prevent hallucination.
- **Citation Enforcement**: Every statement maps back to bracketed chunk references (`[1]`, `[2]`). Answers lacking verifiable citations are automatically demoted to Low confidence.
- **Confidence Scoring**: Answers are classified into distinct confidence tiers (`High`, `Medium`, `Low`) based on semantic similarity and citation coverage.
- **Human-in-the-Loop Drafting**: AI-generated responses serve as agent drafts; no draft is dispatched without explicit human agent confirmation.
- **Audit Logging**: Every query, retrieved passage, confidence score, and issued citation is logged for compliance audits.
- **Prompt Injection Defense**: Uploaded document content is strictly delimited (`=== CONTEXT ===`), preventing adversarial documents from altering system instructions.

---

## Getting Started

### Prerequisites
- [Docker & Docker Compose](https://www.docker.com/)
- Optional for manual dev: Python 3.12+, Node.js 18+

---

### Running Full Stack with Docker Compose

To start the database with `pgvector`, Redis, the FastAPI backend, the Celery worker, and the React frontend:

```bash
docker compose up --build
```

- **Frontend Application**: http://localhost:80
- **FastAPI Interactive Docs (Swagger)**: http://localhost:8000/docs
- **API Health Check**: http://localhost:8000/health

> **Deterministic Mock LLM Mode:**  
> By default, the application runs with `LLM_PROVIDER=mock`, allowing full end-to-end evaluation, testing, and UI exploration without requiring paid third-party API keys.

---

## Seeded Demo Credentials

On initial startup, the database seeds the default support workspace and demo users:

| Email | Password | Role | Description |
| :--- | :--- | :--- | :--- |
| **`admin@insightdesk.local`** | `admin123` | `Admin` | Knowledge base manager; uploads policies and configures confidence thresholds |
| **`agent@insightdesk.local`** | `password123` | `Agent` | Support specialist; searches documentation and reviews draft replies |

---

## Environment Setup

Configuration is controlled via environment variables. See `.env.example` for the template:

```bash
cp .env.example .env
```

| Variable | Default Value | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql+asyncpg://user:password@localhost:5433/insightdesk` | Async SQLAlchemy database URL |
| `REDIS_URL` | `redis://localhost:6379/0` | Celery broker and cache connection string |
| `LLM_PROVIDER` | `mock` | LLM driver (`mock` for local offline testing, `openai` for live model) |
| `OPENAI_API_KEY` | *(optional)* | Required only when `LLM_PROVIDER=openai` |

---

## API Usage

### Query Knowledge Base

```bash
curl -X POST http://localhost:8000/api/v1/query \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is the policy for processing customer refunds?",
    "documentSetId": "00000000-0000-0000-0000-000000000001"
  }'
```

**Example Response:**
```json
{
  "query_id": "8a329d91-3f41-4e2b-bb42-a9b1c5c7d24e",
  "answer": "Based on the provided documentation, refunds are processed within 14 business days. [1]",
  "confidence_tier": "high",
  "citations": [
    {
      "document_id": "00000000-0000-0000-0000-000000000001",
      "chunk_id": "11111111-1111-1111-1111-111111111111",
      "text": "Refunds are processed within 14 business days upon return confirmation.",
      "relevance": 0.88
    }
  ]
}
```

---

## Database Schema (ERD)

```mermaid
erDiagram
    WORKSPACES ||--o{ USERS : contains
    WORKSPACES ||--o{ DOCUMENTS : owns
    WORKSPACES ||--o{ QUERIES : logs
    DOCUMENTS ||--o{ CHUNKS : splits_into
    QUERIES ||--o{ CITATIONS : includes
    CHUNKS ||--o{ CITATIONS : referenced_by

    WORKSPACES {
        uuid id PK
        string name
        numeric confidence_threshold
        datetime created_at
    }

    USERS {
        uuid id PK
        uuid workspace_id FK
        string email
        string password_hash
        string role
        datetime created_at
    }

    DOCUMENTS {
        uuid id PK
        uuid workspace_id FK
        string title
        string status
        datetime created_at
    }

    CHUNKS {
        uuid id PK
        uuid document_id FK
        text content
        vector embedding
        int chunk_index
    }

    QUERIES {
        uuid id PK
        uuid workspace_id FK
        uuid user_id FK
        text question_text
        text answer_text
        float confidence_score
        string confidence_tier
        boolean answered
        datetime created_at
    }

    CITATIONS {
        uuid id PK
        uuid query_id FK
        uuid chunk_id FK
        float relevance_score
    }
```

---

## Running Automated Tests

The test suite covers RAG pipeline execution, confidence scoring downgrades, below-threshold short-circuiting, and prompt-injection safety defenses:

```bash
cd backend
python -m pytest tests
```

To run frontend production build checks:

```bash
cd frontend
npm run build
```

---

## Responsible AI & Security

- **Strict Prompt Delimitation**: Context chunks are wrapped in custom delimiter tags (`=== CONTEXT ===`). System instructions explicitly declare that context data must be treated as reference material, never as instructions to follow.
- **Guaranteed Fallback**: If zero chunks satisfy the workspace similarity threshold, the model is not invoked and a deterministic refusal is returned.
- **RBAC**: Document uploads and threshold adjustments are restricted to `Admin` users; support `Agent` users can query and review.

---

## Limitations / Not Yet Implemented

1. **Live Hosted Demo**: A live public demo is not currently deployed to Cloud Run due to token budget and hosting constraints; the complete stack runs locally via Docker Compose in mocked LLM mode.
2. **Streaming Tokens (SSE)**: The `/api/v1/query` endpoint returns synchronous JSON payloads; token-by-token streaming via Server-Sent Events (SSE) is planned on the roadmap (see `docs/roadmap.md`).
3. **Document Ingestion Formats**: Ingestion currently processes raw text and markdown documents; PDF parsing (OCR and table extraction) is queued for subsequent releases.
4. **Multi-Turn Conversation**: Queries are currently evaluated on an atomic, single-turn basis; conversational chat session memory is on the roadmap.
