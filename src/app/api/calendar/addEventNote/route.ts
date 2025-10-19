import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Event from "@/models/Event";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { eventId, text, addedBy } = body;

    if (!eventId || !text)
      return NextResponse.json({ message: "Event ID and note text are required" }, { status: 400 });

    const event = await Event.findByIdAndUpdate(
      eventId,
      { $push: { notes: { text, addedBy } } },
      { new: true }
    );

    if (!event) return NextResponse.json({ message: "Event not found" }, { status: 404 });

    return NextResponse.json(event, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
