"use server";

import { cookies } from "next/headers";

export async function setCookies(token: string) {
  const cookie = await cookies();
  cookie.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearCookies() {
  const cookie = await cookies();
  cookie.delete("access_token");
}

export async function verifyCookies() {
  const cookie = await cookies();
  cookie.get("access_token");
}

export async function setVerifyCookies() {
  const cookie = await cookies();
  cookie.set("verify_state", "unverified", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 5,
  });
}
