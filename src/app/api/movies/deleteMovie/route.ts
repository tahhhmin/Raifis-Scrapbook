import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Movie from "@/models/Movie";

export async function DELETE(req: NextRequest) {
  await connectDB();

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

    await Movie.findByIdAndDelete(id);
    return NextResponse.json({ message: "Movie deleted" }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
