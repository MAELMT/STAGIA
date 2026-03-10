import json
import random

def analyze_job(title: str, company: str, location: str, description: str) -> dict:
    """
    Mock AI for testing because Ollama inference is too slow without a GPU.
    In production, this would use Ollama or an external API like Gemini.
    """
    print(f"🧠 [MOCK AI] Analyse en cours pour : {title}")
    
    # Calculate a mock score based on keywords to simulate AI decision
    score = 50
    text_lower = (title + " " + description).lower()
    
    if "marketing" in text_lower or "luxe" in text_lower or "finance" in text_lower:
        score += 30
    if "stage" in text_lower or "intern" in text_lower:
        score += 15
    if "france" in location.lower() or "paris" in location.lower():
        score -= 20 # Nina veut l'étranger
        
    score = max(0, min(100, score))
    
    reasons = [
        "Parfait pour le profil !", 
        "Correspondance avec le marketing.", 
        "Bon lieu, mais domaine à vérifier.",
        "Exactement ce que Nina cherche !"
    ]
    
    return {
        "score": score,
        "analysis": random.choice(reasons) if score > 70 else "Le score de compatibilité est moyen."
    }
