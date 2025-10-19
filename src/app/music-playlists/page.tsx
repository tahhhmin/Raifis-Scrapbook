"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

interface Playlist {
  _id: string;
  name: string;
  url: string;
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");

  const OUR_BLEND = {
    name: "Our Blend",
    url: "https://open.spotify.com/playlist/37i9dQZF1EJKfm8uJhYfdL?si=791e82bedaae40fa",
  };

  const fetchPlaylists = async () => {
    const res = await fetch("/api/playlists/getPlaylists");
    const data = await res.json();
    setPlaylists(data);
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleAddPlaylist = async () => {
    if (!newName || !newUrl) return;
    const res = await fetch("/api/playlists/addPlaylist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, url: newUrl, addedBy: "Annafi" }),
    });
    const data = await res.json();
    setPlaylists([data, ...playlists]);
    setNewName("");
    setNewUrl("");
  };

  const handleEditPlaylist = async (id: string) => {
    const res = await fetch("/api/playlists/editPlaylist", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: editName, url: editUrl }),
    });
    const updated = await res.json();
    setPlaylists(playlists.map((p) => (p._id === id ? updated : p)));
    setEditingId(null);
  };

  const handleDeletePlaylist = async (id: string) => {
    await fetch("/api/playlists/deletePlaylist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPlaylists(playlists.filter((p) => p._id !== id));
  };

  return (
    <div className={styles.container}>
      <h1>🎵 Music Playlists</h1>

      {/* Our Blend link at top */}
      <div className={styles.ourBlend}>
        <h3>{OUR_BLEND.name}</h3>
        <a href={OUR_BLEND.url} target="_blank" rel="noopener noreferrer">
          Open in Spotify
        </a>
      </div>

      {/* Add Playlist */}
      <div className={styles.addPlaylist}>
        <input
          type="text"
          placeholder="Playlist Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Spotify URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
        />
        <button onClick={handleAddPlaylist}>Add Playlist</button>
      </div>

      {/* Playlist List */}
      <div className={styles.playlistList}>
        {playlists.map((playlist) => (
          <div key={playlist._id} className={styles.playlistCard}>
            {editingId === playlist._id ? (
              <>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                <input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} />
                <button onClick={() => handleEditPlaylist(playlist._id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h3>{playlist.name}</h3>
                <a href={playlist.url} target="_blank" rel="noopener noreferrer">
                  Open in Spotify
                </a>
                <button
                  onClick={() => {
                    setEditingId(playlist._id);
                    setEditName(playlist.name);
                    setEditUrl(playlist.url);
                  }}
                >
                  ✏️ Edit
                </button>
                <button onClick={() => handleDeletePlaylist(playlist._id)}>❌ Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
