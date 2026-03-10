from duckduckgo_search import DDGS
import json

with DDGS() as ddgs:
    query = 'offre emploi "stage marketing italie 6 mois" internship'
    results = list(ddgs.text(query, region='fr-fr', max_results=3))
    print(json.dumps(results, indent=2, ensure_ascii=False))
