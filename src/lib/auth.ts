// src/lib/auth.ts
import { AuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import mongoose from "mongoose";
import connectDB from "./connectDB";
import { MongoClient } from "mongodb";

// Helper to get MongoClient safely
let cachedClient: MongoClient | null = null;
export async function getClientPromise(): Promise<MongoClient> {
  if (cachedClient) return cachedClient;

  await connectDB();

  const client = mongoose.connection.getClient?.();
  if (!client) throw new Error("MongoClient not available on mongoose.connection");

  cachedClient = client as unknown as MongoClient;
  return cachedClient;
}

// Auth options
export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(getClientPromise()), // Pass Promise<MongoClient>
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token?.sub ?? null,
        },
      } as Session & { user: { id: string | null } };
    },
  },
  debug: false,
};
