"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import style from "./MovieList.module.css";

interface Review {
  text: string;
  addedBy: string;
}

interface Movie {
  _id: string;
  title: string;
  status: "to-watch" | "watched";
  reviews?: Review[];
  rating?: string;
  thumbnail?: string;
}

export default function MovieList() {
  const { data: session } = useSession();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState<"to-watch" | "watched">("to-watch");
  const [reviewText, setReviewText] = useState<{ [key: string]: string }>({});

  const fetchMovies = async () => {
    const res = await fetch("/api/movies/getMovies");
    const data = await res.json();
    setMovies(data);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleAddMovie = async () => {
    if (!newTitle || !session?.user?.name) return;

    const res = await fetch("/api/movies/addMovie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, status: newStatus, addedBy: session.user.name }),
    });

    const data = await res.json();
    setMovies([data, ...movies]);
    setNewTitle("");
    setNewStatus("to-watch");
  };

  const handleDeleteMovie = async (id: string) => {
    await fetch("/api/movies/deleteMovie", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setMovies(movies.filter((m) => m._id !== id));
  };

  const handleMarkWatched = async (id: string) => {
    const res = await fetch("/api/movies/editMovie", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "watched" }),
    });
    const updatedMovie = await res.json();
    setMovies(movies.map((m) => (m._id === id ? updatedMovie : m)));
  };

  const handleAddReview = async (id: string) => {
    const review = reviewText[id];
    if (!review || !session?.user?.name) return;

    const res = await fetch("/api/movies/addMovieReview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, review, addedBy: session.user.name }),
    });

    const updatedMovie = await res.json();
    setMovies(movies.map((m) => (m._id === id ? updatedMovie : m)));
    setReviewText({ ...reviewText, [id]: "" });
  };

  const toWatchMovies = movies.filter((m) => m.status === "to-watch");
  const watchedMovies = movies.filter((m) => m.status === "watched");

  return (
    <div className={style.container}>
      <h2>🎬 Movie List</h2>

      {/* Add Movie */}
      <div className={style.addMovieForm}>
        <input
          type="text"
          placeholder="Movie title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value as "to-watch" | "watched")}
        >
          <option value="to-watch">To Watch</option>
          <option value="watched">Watched</option>
        </select>
        <button onClick={handleAddMovie} disabled={!session}>
          Add Movie
        </button>
        {!session && <p>Login to add movies and reviews</p>}
      </div>

      {/* To Watch */}
      <h3>📌 To Watch</h3>
      <div className={style.movieList}>
        {toWatchMovies.map((movie) => (
          <div key={movie._id} className={style.movieCard}>
            {movie.thumbnail && (
              <Image
                src={movie.thumbnail}
                alt={movie.title}
                width={100}
                height={150}
                className={style.thumbnail}
              />
            )}
            <div className={style.movieInfo}>
              <h4>{movie.title}</h4>
              {movie.rating && <p>Rating: {movie.rating}</p>}
              <button onClick={() => handleMarkWatched(movie._id)}>✅ Mark as Watched</button>
              <button onClick={() => handleDeleteMovie(movie._id)}>❌ Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Watched */}
      <h3>🏆 Watched</h3>
      <div className={style.movieList}>
        {watchedMovies.map((movie) => (
          <div key={movie._id} className={style.movieCard}>
            {movie.thumbnail && (
              <Image
                src={movie.thumbnail}
                alt={movie.title}
                width={100}
                height={150}
                className={style.thumbnail}
              />
            )}
            <div className={style.movieInfo}>
              <h4>{movie.title}</h4>
              {movie.rating && <p>Rating: {movie.rating}</p>}

              {/* Add review */}
              <input
                type="text"
                placeholder="Add review..."
                value={reviewText[movie._id] || ""}
                onChange={(e) =>
                  setReviewText({ ...reviewText, [movie._id]: e.target.value })
                }
                disabled={!session}
              />
              <button onClick={() => handleAddReview(movie._id)} disabled={!session}>
                Add Review
              </button>

              {/* Show reviews */}
              {movie.reviews?.map((r, idx) => (
                <p key={idx}>
                  <strong>{r.addedBy}:</strong> {r.text}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
