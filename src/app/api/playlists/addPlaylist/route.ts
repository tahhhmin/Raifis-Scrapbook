// src/app/api/playlists/addPlaylist/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Playlist from "@/models/Playlist";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { name, url, addedBy } = await req.json();
    if (!name || !url) {
      return NextResponse.json({ message: "Name and URL required" }, { status: 400 });
    }

    const newPlaylist = await Playlist.create({ name, url, addedBy: addedBy || "Unknown" });
    return NextResponse.json(newPlaylist, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    console.error("Error adding playlist:", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
