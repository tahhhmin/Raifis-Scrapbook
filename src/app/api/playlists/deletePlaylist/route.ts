// src/app/api/playlists/deletePlaylist/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Playlist from "@/models/Playlist";

export async function DELETE(req: NextRequest) {
  await connectDB();
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ message: "ID required" }, { status: 400 });
    }

    await Playlist.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    console.error("Error deleting playlist:", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
