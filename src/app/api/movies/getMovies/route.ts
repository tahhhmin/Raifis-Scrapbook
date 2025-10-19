import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Movie from "@/models/Movie";

export async function GET() {
  await connectDB();

  try {
    const movies = await Movie.find().sort({ createdAt: -1 }).limit(50);
    return NextResponse.json(movies, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
