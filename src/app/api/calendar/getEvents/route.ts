import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Event from "@/models/Event";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const events = await Event.find({}).sort({ date: 1 });
    return NextResponse.json(events, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
