// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import mongoose from "mongoose";
import connectDB from "@/lib/connectDB";
import { MongoClient } from "mongodb";

// Ensure we have a Promise<MongoClient> for the adapter
async function getClientPromise(): Promise<MongoClient> {
  await connectDB();
  // @ts-ignore getClient exists on mongoose.connection
  return mongoose.connection.getClient() as MongoClient;
}

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(getClientPromise()), // use a Promise<MongoClient>
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt", // using JWT for session
  },
  callbacks: {
    async session({ session, token }) {
      // token.sub contains the user ID when using JWT sessions
      return {
        ...session,
        user: {
          ...session.user,
          id: token?.sub ?? null,
        },
      } as Session & { user: { id: string | null } };
    },
  },
  debug: false, // you can set to true for dev
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
