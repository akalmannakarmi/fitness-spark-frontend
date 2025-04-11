import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_FITNESS_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ success: false, message: data.message || "Login failed" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("token", data.access_token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ success: true });
}
