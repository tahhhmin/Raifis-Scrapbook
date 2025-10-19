import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Movie from "@/models/Movie";

export async function PUT(req: NextRequest) {
  await connectDB();

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ message: "ID and status are required" }, { status: 400 });
    }

    const movie = await Movie.findById(id);
    if (!movie) {
      return NextResponse.json({ message: "Movie not found" }, { status: 404 });
    }

    movie.status = status;
    await movie.save();

    return NextResponse.json(movie, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
