import { NextRequest, NextResponse } from "next/server";
import { getUserData, saveUserData } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const userData = await getUserData(email);
    return NextResponse.json({ success: true, userData });
  } catch (e: any) {
    return NextResponse.json({ success: true, userData: null });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email?.trim().toLowerCase();
    const name = body.name?.trim() || "";
    const stores = body.stores || [];
    const activeId = body.activeId || "";
    const customPrompts = body.customPrompts || {};
    const tasks = body.tasks || {};

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const savedUser = await saveUserData({
      email,
      name,
      stores,
      activeId,
      customPrompts,
      tasks,
    });

    return NextResponse.json({ success: true, userData: savedUser });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to save" }, { status: 500 });
  }
}

