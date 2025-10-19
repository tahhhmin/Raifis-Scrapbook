// src/app/api/playlists/getPlaylists/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Playlist from "@/models/Playlist";

export async function GET() {
  await connectDB();
  try {
    const playlists = await Playlist.find().sort({ createdAt: -1 });
    return NextResponse.json(playlists);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    console.error("Error fetching playlists:", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
