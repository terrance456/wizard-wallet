"use client";

import { signOut } from "next-auth/react";

export default function SignIn() {
  return (
    <>
      <button type="submit">Signin with Google</button>
      <button onClick={() => signOut()}>logout</button>
    </>
  );
}
