// app/api/playlists/deletePlaylist/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Playlist from "@/models/Playlist";

export async function DELETE(req: NextRequest) {
  await connectDB();
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });
    await Playlist.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
