import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function App() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('stage marketing luxe london');
  const [isSearching, setIsSearching] = useState(false);
  const [notification, setNotification] = useState('');

  // Fetch jobs from backend
  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/jobs`);
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Erreur de connexion au serveur", err);
    }
  };

  useEffect(() => {
    fetchJobs();
    // Refresh jobs every 10 seconds in case a search is running
    const interval = setInterval(fetchJobs, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) return;
    setIsSearching(true);
    setNotification("L'Agent IA parcourt le web pour toi... 🕵️‍♀️✨ (Cela peut prendre qq minutes)");

    try {
      await fetch(`${API_URL}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: search, max_results: 5 })
      });
      // We don't wait for results, as it runs in background.
    } catch (err) {
      console.error("Erreur de recherche", err);
      setNotification("Oops, problème de connexion avec l'IA 😥");
    } finally {
      setTimeout(() => setIsSearching(false), 2000);
    }
  };

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="header glass-panel animate-fade-in">
        <h1 className="main-title title-gradient">
          <span className="sparkles">✨</span>
          Nina la plus belle va trouvé un stage
          <span className="sparkles">👑</span>
        </h1>
        <p className="subtitle">
          Ton Agent IA personnel parcourt le web pour te dénicher les meilleures offres !
        </p>
      </header>

      {/* Search Controls */}
      <section className="controls-container glass-panel animate-fade-in delay-1">
        <div className="input-group" style={{ flex: 2 }}>
          <label>Que cherches-tu exactement ?</label>
          <input
            type="text"
            className="input-field"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ex: stage finance 6 mois italie"
          />
        </div>
        <button
          className="search-btn"
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? "L'IA cherche... 🔍" : "Trouver mon stage 💖"}
        </button>
      </section>

      {notification && (
        <div style={{ textAlign: "center", color: "var(--primary-dark)", fontWeight: "bold", padding: "10px", background: "var(--glass-bg)", borderRadius: "12px" }} className="animate-fade-in delay-2">
          {notification}
        </div>
      )}

      {/* Jobs Grid */}
      <main className="jobs-grid animate-fade-in delay-3">
        {jobs.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
            <h2>Aucune offre pour le moment 🥺</h2>
            <p>Lance une recherche magique avec le bouton ci-dessus !</p>
          </div>
        ) : jobs.map((job) => (
          <div key={job.id} className="job-card glass-panel" onClick={() => window.open(job.url, '_blank')}>
            <div className="job-header">
              <div className="company-logo-placeholder">
                {job.title.includes('Marketing') || job.title.includes('Luxe') ? '💄' : '💼'}
              </div>
              <div className="match-badge">
                <span>{job.match_score}% Match</span>
                <span>⭐</span>
              </div>
            </div>

            <div className="job-info">
              <h3 className="job-title">{job.title}</h3>
              <p className="company-name">{job.company}</p>
            </div>

            <div className="job-meta">
              <span className="meta-tag">📍 {job.location}</span>
              <span className="meta-tag">📅 Il y a qq instants</span>
            </div>

            <p className="job-desc">
              <strong>Avis de l'IA :</strong> {job.ai_analysis}
            </p>

            <button className="apply-btn">
              Voir l'offre incroyable
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
