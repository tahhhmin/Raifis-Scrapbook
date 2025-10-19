// app/api/calendar/addEvent/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Event from "@/models/Event";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    console.log("Incoming body:", body); // 🔹 Debug: verify fields

    const { title, date, addedBy, repeat, isMilestone } = body;

    if (!title || !date) {
      return NextResponse.json(
        { message: "Title and date are required" },
        { status: 400 }
      );
    }

    // Ensure repeat and isMilestone have correct values
    const validRepeat: "none" | "monthly" | "yearly" =
      repeat === "monthly" || repeat === "yearly" ? repeat : "none";
    const validMilestone: boolean =
      typeof isMilestone === "boolean" ? isMilestone : false;

    const newEvent = await Event.create({
      title,
      date,
      addedBy: addedBy || "Unknown",
      repeat: validRepeat,
      isMilestone: validMilestone,
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating event:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ message }, { status: 500 });
  }
}
