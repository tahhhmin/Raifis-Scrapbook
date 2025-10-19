import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Movie from "@/models/Movie";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { id, review, addedBy = "Annafi" } = await req.json();
    if (!id || !review) {
      return NextResponse.json({ message: "ID and review are required" }, { status: 400 });
    }

    const movie = await Movie.findById(id);
    if (!movie) {
      return NextResponse.json({ message: "Movie not found" }, { status: 404 });
    }

    // Add review
    if (!movie.reviews) movie.reviews = [];
    movie.reviews.push({ text: review, addedBy });
    await movie.save();

    return NextResponse.json(movie, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
