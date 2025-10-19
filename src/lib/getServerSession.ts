// src/lib/getServerSession.ts
import { getServerSession as nextAuthSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { headers } from "next/headers";

export const getServerSession = async () => {
  const req = { headers: headers() }; // NextAuth only needs headers in App Router
  return await nextAuthSession({ req, ...authOptions });
};
