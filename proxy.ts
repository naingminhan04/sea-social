import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export default async function proxy(req: NextRequest) {
  const protectedRoutes = ["/home","/chatroom","/chat","/user","/post"];
  const guestRoutes = ["/", "/signup"];
  const verifyRoute = ["/verify"];
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isGuestRoute = guestRoutes.includes(path);
  const isVerifyRoute = verifyRoute.includes(path);
  const cookie = (await cookies()).get("access_token")?.value;
  const verifyState = (await cookies()).get("verify_state");

  if (isProtectedRoute) {
    if (!cookie && !verifyState) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    if (!cookie && verifyState) {
      return NextResponse.redirect(new URL("/verify", req.nextUrl));
    }

    return NextResponse.next();
  }
  if (isGuestRoute) {
    if (cookie) {
      return NextResponse.redirect(new URL("/home", req.nextUrl));
    }
    if (verifyState) {
      return NextResponse.redirect(new URL("/verify", req.nextUrl));
    }

    return NextResponse.next();
  }
  if (isVerifyRoute) {
    if (!verifyState) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    if (cookie) {
      return NextResponse.redirect(new URL("/home", req.nextUrl));
    }

    return NextResponse.next();
  }
}
