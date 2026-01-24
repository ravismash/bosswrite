"use client";
import { useState } from "react";
import styles from "./page.module.css";

export default function GhostwriterUI() {
  const [youtubeUrl, setYoutubeUrl] = useState(""); // Changed from input
  const [samples, setSamples] = useState("");
  const [userType, setUserType] = useState("solopreneur");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePost = async () => {
    setLoading(true);
    setResult("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          videoUrl: youtubeUrl, // Sending URL instead of text
          linkedinSamples: samples,
          userType: userType 
        }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.post);
    } catch (error: any) {
      alert(error.message || "Error generating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2>Ghostwriter AI</h2>
        <div style={{ marginTop: '2rem' }}>
          <label className={styles.label}>I am a:</label>
          <select 
            className={styles.textArea} 
            style={{ height: '40px' }}
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="solopreneur">Solopreneur</option>
            <option value="agency_founder">Agency Founder</option>
            <option value="executive">Corporate Executive</option>
            <option value="ghostwriter">Professional Ghostwriter</option>
          </select>
        </div>
      </aside>

      <main className={styles.main}>
        <label className={styles.label}>YouTube Video Link</label>
        <input 
          type="text"
          className={styles.textArea}
          style={{ height: '50px' }}
          placeholder="https://www.youtube.com/watch?v=..."
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />

        <label className={styles.label}>Voice DNA (Past LinkedIn Posts)</label>
        <textarea 
          className={styles.textArea}
          style={{ height: '120px' }}
          placeholder="Paste 2-3 examples of your writing style here..."
          value={samples}
          onChange={(e) => setSamples(e.target.value)}
        />

        <button 
          className={styles.button} 
          onClick={generatePost}
          disabled={loading || !youtubeUrl}
        >
          {loading ? "Fetching Transcript & Writing..." : "Generate LinkedIn Post"}
        </button>

        {result && (
          <div className={styles.resultBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>Generated Post</h3>
              <button onClick={() => navigator.clipboard.writeText(result)} style={{background: 'none', border: '1px solid #ccc', cursor: 'pointer', borderRadius: '4px'}}>Copy</button>
            </div>
            <hr />
            <p>{result}</p>
          </div>
        )}
      </main>
    </div>
  );
}