// src/app/api/movies/getMovies/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Movie from "@/models/Movie";

export async function GET() {
  await connectDB();

  try {
    const movies = await Movie.find().sort({ createdAt: -1 }).limit(50);
    return NextResponse.json(movies, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    console.error("Error fetching movies:", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
