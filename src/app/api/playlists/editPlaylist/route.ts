// src/app/api/playlists/editPlaylist/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Playlist from "@/models/Playlist";

export async function PUT(req: NextRequest) {
  await connectDB();
  try {
    const { id, name, url } = await req.json();
    if (!id || !name || !url) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const updated = await Playlist.findByIdAndUpdate(
      id,
      { name, url },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    console.error("Error editing playlist:", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
