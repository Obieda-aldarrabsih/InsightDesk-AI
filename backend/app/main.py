from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
import uuid
import hashlib

from app.core.database import engine, Base, AsyncSessionLocal
from app.models.workspace import Workspace
from app.models.user import User
from app.models.document import Document, Chunk
from app.models.query import Query, Citation

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-initialize pgvector extension, schema tables, and demo seed data
    try:
        async with engine.begin() as conn:
            # Enable pgvector if available on Postgres
            try:
                await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
            except Exception:
                pass
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncSessionLocal() as session:
            workspace_id = uuid.UUID("00000000-0000-0000-0000-000000000001")
            existing_ws = await session.get(Workspace, workspace_id)
            if not existing_ws:
                ws = Workspace(
                    id=workspace_id,
                    name="Default Support Workspace",
                    confidence_threshold=0.65
                )
                session.add(ws)
                await session.flush()

                # Demo credentials:
                # Admin: admin@insightdesk.local / admin123
                # Agent: agent@insightdesk.local / password123
                admin = User(
                    id=uuid.UUID("00000000-0000-0000-0000-000000000002"),
                    workspace_id=workspace_id,
                    email="admin@insightdesk.local",
                    password_hash=hashlib.sha256("admin123".encode()).hexdigest(),
                    role="Admin"
                )
                agent = User(
                    id=uuid.UUID("00000000-0000-0000-0000-000000000003"),
                    workspace_id=workspace_id,
                    email="agent@insightdesk.local",
                    password_hash=hashlib.sha256("password123".encode()).hexdigest(),
                    role="Agent"
                )
                session.add_all([admin, agent])
                await session.commit()
                print("Seeded demo accounts: admin@insightdesk.local (admin123), agent@insightdesk.local (password123)")
    except Exception as e:
        print(f"Startup initialization notice: {e}")
    yield

app = FastAPI(
    title="InsightDesk AI API",
    description="Grounded Retrieval-Augmented Knowledge & Support Assistant",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/health/ready")
def readiness_check():
    return {"status": "ready"}

from app.api.query_router import router as query_router
app.include_router(query_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
