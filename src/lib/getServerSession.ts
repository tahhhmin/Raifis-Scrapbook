// src/lib/getServerSession.ts
import { getServerSession as nextAuthSession } from "next-auth/next";
import { authOptions } from "./auth"; // ✅ import from lib/auth.ts
import { headers } from "next/headers";

export const getServerSession = async () => {
  const req = { headers: headers() }; // NextAuth only needs headers in App Router
  return await nextAuthSession({ req, ...authOptions });
};
