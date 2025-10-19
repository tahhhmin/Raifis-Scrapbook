// src/app/api/movies/addMovie/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Movie from "@/models/Movie";

const OMDB_API_KEY = process.env.OMDB_API_KEY;

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { title, status = "to-watch", addedBy = "Annafi" } = await req.json();

    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    // Fetch data from OMDb
    let rating: string | undefined = undefined;
    let thumbnail: string | undefined = undefined;

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`
      );
      const data = await res.json();
      if (data.Response === "True") {
        rating = data.Ratings?.[0]?.Value || undefined;
        thumbnail = data.Poster !== "N/A" ? data.Poster : undefined;
      }
    } catch (err: unknown) {
      console.error("OMDb fetch failed:", err);
    }

    const newMovie = await Movie.create({
      title,
      status,
      addedBy,
      rating,
      thumbnail,
    });

    return NextResponse.json(newMovie, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    console.error("Error adding movie:", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
