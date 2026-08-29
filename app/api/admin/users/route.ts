import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "user_stores.json");

function readDb(): Record<string, any> {
  try {
    if (!fs.existsSync(DB_FILE)) return {};
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw || "{}");
  } catch (e) {
    return {};
  }
}

export async function GET() {
  const db = readDb();
  const users = Object.values(db).map((u: any) => ({
    name: u.name || "Unnamed",
    email: u.email || "",
    stores: u.stores || [],
    activeId: u.activeId || "",
    updatedAt: u.updatedAt || "",
  }));

  return NextResponse.json({ success: true, users });
}
