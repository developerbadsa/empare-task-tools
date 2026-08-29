import { NextRequest, NextResponse } from "next/server";
import { getAdminInstructions, saveAdminInstructions } from "@/lib/db";

export async function GET() {
  try {
    const instructions = await getAdminInstructions();
    return NextResponse.json({ success: true, instructions });
  } catch (e: any) {
    return NextResponse.json({ success: true, instructions: null });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, text, isActive } = body;

    const data = await saveAdminInstructions({
      title,
      text,
      isActive,
    });

    return NextResponse.json({ success: true, instructions: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to save instructions" }, { status: 500 });
  }
}

