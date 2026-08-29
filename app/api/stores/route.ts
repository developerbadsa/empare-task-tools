import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "user_stores.json");

function ensureDbFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({}), "utf-8");
  }
}

function readDb(): Record<string, any> {
  ensureDbFile();
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw || "{}");
  } catch (e) {
    return {};
  }
}

function writeDb(data: Record<string, any>) {
  ensureDbFile();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const db = readDb();
  const userData = db[email] || null;

  return NextResponse.json({ success: true, userData });
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

    const db = readDb();
    db[email] = {
      name: name || db[email]?.name || "",
      email: email,
      stores: stores,
      activeId: activeId,
      customPrompts: customPrompts,
      tasks: tasks,
      updatedAt: new Date().toISOString(),
    };

    writeDb(db);

    return NextResponse.json({ success: true, userData: db[email] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to save" }, { status: 500 });
  }
}
