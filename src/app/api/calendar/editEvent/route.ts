// app/api/calendar/editEvent/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Event from "@/models/Event";

export async function PUT(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    console.log("Incoming edit body:", body); // 🔹 Debug

    const { id, title, date, repeat, isMilestone } = body;

    if (!id || !title || !date) {
      return NextResponse.json(
        { message: "ID, title and date are required" },
        { status: 400 }
      );
    }

    // Ensure valid repeat & milestone values
    const validRepeat: "none" | "monthly" | "yearly" =
      repeat === "monthly" || repeat === "yearly" ? repeat : "none";
    const validMilestone: boolean =
      typeof isMilestone === "boolean" ? isMilestone : false;

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        title,
        date,
        repeat: validRepeat,
        isMilestone: validMilestone,
      },
      { new: true } // return the updated document
    );

    if (!updatedEvent) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error: any) {
    console.error("Error editing event:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
