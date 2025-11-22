"use client";

import { useState, useEffect } from "react";

type Url = {
  id: number;
  original: string;
  short: string;
  clicks: number;
  lastClicked: string | null;
};

export default function Home() {
  const [urls, setUrls] = useState<Url[]>([]);
  const [original, setOriginal] = useState("");
  const [short, setShort] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mounted, setMounted] = useState(false);

  // Fetch all URLs from API
  const fetchUrls = async () => {
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      setUrls(data);
    } catch {
      setError("Failed to fetch URLs");
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchUrls();
  }, []);

  // Handle adding a new short URL
  const handleAdd = async () => {
    setError("");
    setSuccess("");

    if (!original.trim() || !short.trim()) {
      setError("Both fields are required");
      return;
    }

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original: original.trim(), short: short.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess("Short URL created successfully!");
        setOriginal("");
        setShort("");
        fetchUrls();
      }
    } catch {
      setError("Server error while creating short URL");
    }
  };

  if (!mounted) return null; // Avoid hydration errors

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>TinyLink Dashboard</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Original URL"
          value={original}
          onChange={(e) => setOriginal(e.target.value)}
          style={{ marginRight: "0.5rem", width: "300px" }}
        />
        <input
          type="text"
          placeholder="Short code"
          value={short}
          onChange={(e) => setShort(e.target.value)}
          style={{ marginRight: "0.5rem", width: "150px" }}
        />
        <button onClick={handleAdd}>Add URL</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <h2>All URLs</h2>
      <table border={1} cellPadding={5} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Short Code</th>
            <th>Original URL</th>
            <th>Clicks</th>
            <th>Last Clicked</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url.id}>
              <td>{url.short}</td>
              <td>
                <a href={url.original} target="_blank" rel="noreferrer">
                  {url.original}
                </a>
              </td>
              <td>{url.clicks}</td>
              <td>{url.lastClicked ? new Date(url.lastClicked).toLocaleString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
