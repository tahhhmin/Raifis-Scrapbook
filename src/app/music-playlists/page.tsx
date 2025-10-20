"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Button from "@/components/common/buttons/Button";
import { Plus } from "lucide-react";

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
  const [showAddForm, setShowAddForm] = useState(false); // 👈 new state

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
    setShowAddForm(false); // 👈 hide form after adding
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
      {/* Our Blend link at top */}
      <div className={styles.ourBlend}>
        <p className={styles.ourBlendTitle}>Our Spotify Blend</p>
        <Link href={OUR_BLEND.url} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" label="Open Spotify" size="medium" showIcon />
        </Link>
      </div>

      {/* Add Playlist Section */}
      <div className={styles.addPlaylistContainer}>
        <div className={styles.addPlaylistTitleContainer}>
          <p>Add New Playlist</p>
          <Plus
            className={styles.icon}
            onClick={() => setShowAddForm((prev) => !prev)} // 👈 toggle
            style={{ cursor: "pointer" }}
          />
        </div>

        {/* Conditionally show form */}
        {showAddForm && (
          <div className={styles.addPlaylistInputs}>
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
        )}
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
              <div className={styles.playlistHeader}>
                <p className={styles.playlistName}>{playlist.name}</p>
                <Link href={playlist.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" label="Open Spotify" size="medium" showIcon />
                </Link>
                </div>

                <div className={styles.playlistButtons}>
  <Button
    variant="outlined"
    showIcon
    icon="Pencil"
    label="Edit"
    onClick={() => {
      setEditingId(playlist._id);
      setEditName(playlist.name);
      setEditUrl(playlist.url);
    }}
  />

  <Button
    variant="danger-icon"
    showIcon
    icon="Trash"
    onClick={() => handleDeletePlaylist(playlist._id)}
    aria-label="Delete playlist"
  />
</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
