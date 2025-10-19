// models/Playlist.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPlaylist extends Document {
  name: string;
  url: string;
  addedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PlaylistSchema: Schema<IPlaylist> = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    addedBy: { type: String, default: "Unknown" },
  },
  { timestamps: true }
);

const Playlist: Model<IPlaylist> =
  mongoose.models.Playlist || mongoose.model<IPlaylist>("Playlist", PlaylistSchema);

export default Playlist;
