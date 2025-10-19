// src/app/api/movies/deleteMovie/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Movie from "@/models/Movie";

export async function DELETE(req: NextRequest) {
  await connectDB();

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

    const deleted = await Movie.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: "Movie not found" }, { status: 404 });

    return NextResponse.json({ message: "Movie deleted" }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    console.error("Error deleting movie:", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
