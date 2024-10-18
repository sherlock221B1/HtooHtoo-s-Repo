"use client";

import { Locations } from "@prisma/client";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

interface Props {
  locations: Locations[];
}

export default function SignOutButton() {
  return (
    <>
      <h2 style={{ cursor: "pointer" }} onClick={() => signOut()}>
        Logout
      </h2>
    </>
  );
}
