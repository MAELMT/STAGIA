import os
import sys
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from database.db import get_db, init_db
from scraper.ai_crawler import search_and_scrape
import pydantic

app = FastAPI(title="STAGEIA - Nina's AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialisation de la BDD au démarrage
@app.on_event("startup")
def startup():
    print("Initialisation de la base de données...")
    init_db()

class SearchRequest(pydantic.BaseModel):
    query: str
    max_results: int = 5

@app.get("/api/jobs")
def get_jobs(min_score: int = 0):
    """Récupère toutes les annonces de la BDD."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, title, company, location, url, match_score, ai_analysis, date_found 
        FROM jobs 
        WHERE match_score >= ? 
        ORDER BY match_score DESC, date_found DESC
    ''', (min_score,))
    jobs = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"jobs": jobs}

@app.post("/api/search")
def trigger_search(req: SearchRequest, background_tasks: BackgroundTasks):
    """Déclenche l'Agent Web Crawler en tâche de fond."""
    background_tasks.add_task(search_and_scrape, req.query, req.max_results)
    return {"message": "L'Agent IA a commencé sa recherche secrète 🕵️‍♀️✨"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api.server:app", host="0.0.0.0", port=8000, reload=True)
