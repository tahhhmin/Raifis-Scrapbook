import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Event from "@/models/Event";

export async function DELETE(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { id } = body;

    if (!id) return NextResponse.json({ message: "Event ID is required" }, { status: 400 });

    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) return NextResponse.json({ message: "Event not found" }, { status: 404 });

    return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
