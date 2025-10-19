import mongoose, { Document, Schema, Model } from "mongoose";

export interface IMovieReview {
  text: string;
  addedBy: string;
  createdAt?: Date;
}

export interface IMovie extends Document {
  title: string;
  status: "to-watch" | "watched";
  reviews?: IMovieReview[];
  rating?: string;
  thumbnail?: string;
  addedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema = new Schema<IMovie>(
  {
    title: { type: String, required: true },
    status: { type: String, enum: ["to-watch", "watched"], default: "to-watch" },
    reviews: [
      {
        text: { type: String, required: true },
        addedBy: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    rating: { type: String },
    thumbnail: { type: String },
    addedBy: { type: String, default: "Unknown" },
  },
  { timestamps: true }
);

const Movie: Model<IMovie> = mongoose.models.Movie || mongoose.model<IMovie>("Movie", MovieSchema);

export default Movie;
