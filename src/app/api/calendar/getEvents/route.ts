// src/app/api/calendar/getEvents/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Event from "@/models/Event";

export async function GET() {
  await connectDB();

  try {
    const events = await Event.find({}).sort({ date: 1 });
    return NextResponse.json(events, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ message }, { status: 500 });
  }
}
