// app/api/playlists/getPlaylists/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Playlist from "@/models/Playlist";

export async function GET() {
  await connectDB();
  try {
    const playlists = await Playlist.find().sort({ createdAt: -1 });
    return NextResponse.json(playlists);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
