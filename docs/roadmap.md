# InsightDesk AI - Technical Roadmap

This roadmap outlines planned enhancements and architectural extensions for InsightDesk AI.

---

## 1. Streaming & Real-Time Responses
- **Server-Sent Events (SSE)**: Implement streaming tokens for the `/api/v1/query` endpoint so that users see real-time generation progress as citations are verified.
- **WebSocket Ticket Co-Pilot**: Integrate direct live drafting for support agent consoles.

## 2. Multilingual Grounded Embeddings
- **Arabic Language Grounding**: Integrate multilingual dense embeddings (`text-embedding-3-small` / Cohere multilingual) with specialized RTL text normalization for Middle Eastern SME support desks.
- **Cross-Lingual Retrieval**: Allow queries in Arabic to search English knowledge bases and return grounded Arabic answers with precise source citations.

## 3. Helpdesk & CRM Integrations
- **Ticketing Webhooks**: Native webhooks for Zendesk, Freshdesk, and Jira Service Management to ingest incoming tickets and generate draft replies pending human review.
- **Automated Re-Indexing**: Listen to document updates in Google Drive, Notion, and Confluence via scheduled Celery tasks.

## 4. Advanced Evaluation & Monitoring
- **RAG Triad Metrics**: Automated tracking of Context Relevance, Groundedness, and Answer Relevance using TruLens or Ragas.
- **Negative Feedback Loop**: Flagged inaccurate drafts automatically route to administrators for knowledge base policy updates.
