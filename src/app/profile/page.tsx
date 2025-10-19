//src/app/profile

"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (session) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {session.user?.image && (
          <img
            src={session.user.image}
            alt={session.user.name || "Profile"}
            style={{ width: 32, height: 32, borderRadius: "50%" }}
          />
        )}
        <span>{session.user?.name}</span>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    );
  }

  return <button onClick={() => signIn("google")}>Login with Google</button>;
}
