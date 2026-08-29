import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, deleteUser, deleteUserStore } from "@/lib/db";

export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json({ success: true, users });
  } catch (e: any) {
    return NextResponse.json({ success: true, users: [] });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.trim().toLowerCase();
    const storeId = searchParams.get("storeId")?.trim();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (storeId) {
      await deleteUserStore(email, storeId);
    } else {
      await deleteUser(email);
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to delete" }, { status: 500 });
  }
}



