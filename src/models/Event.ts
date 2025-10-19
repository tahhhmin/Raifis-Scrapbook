import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEvent extends Document {
  title: string;
  date: Date;
  notes?: {
    _id?: string;
    text: string;
    addedBy?: string;
    createdAt?: Date;
  }[];
  addedBy?: string;
  repeat?: "none" | "monthly" | "yearly";
  isMilestone?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema<IEvent> = new Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    notes: [
      {
        text: { type: String, required: true },
        addedBy: { type: String, default: "Unknown" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    addedBy: { type: String, default: "Unknown" },
    repeat: {
      type: String,
      enum: ["none", "monthly", "yearly"],
      default: "none",
    },
    isMilestone: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 🔹 Force recompilation in dev/hot reload
delete mongoose.models.Event;
const Event: Model<IEvent> = mongoose.model<IEvent>("Event", EventSchema);

export default Event;
