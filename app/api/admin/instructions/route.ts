import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const INSTRUCTIONS_FILE = path.join(DATA_DIR, "admin_instructions.json");

export const MASTER_TEAM_INSTRUCTIONS = {
  title: "Team Guidelines",
  text: `• Always verify payment methods (e.g., BLIK/Przelewy24 for Poland, MobilePay for Denmark).\n• Never retain Asian/AliExpress reference packaging or watermarks.\n• Use 26px for section headings and 14px for body text.\n• Free shipping across all EU target markets.`,
  isActive: true,
  updatedAt: new Date().toISOString(),
};

function ensureInstructionsFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(INSTRUCTIONS_FILE)) {
    fs.writeFileSync(INSTRUCTIONS_FILE, JSON.stringify(MASTER_TEAM_INSTRUCTIONS, null, 2), "utf-8");
  }
}

export async function GET() {
  try {
    ensureInstructionsFile();
    const raw = fs.readFileSync(INSTRUCTIONS_FILE, "utf-8");
    const data = JSON.parse(raw || "{}");
    return NextResponse.json({ success: true, instructions: data.text ? data : MASTER_TEAM_INSTRUCTIONS });
  } catch (e: any) {
    return NextResponse.json({ success: true, instructions: MASTER_TEAM_INSTRUCTIONS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, text, isActive } = body;

    const data = {
      title: title || MASTER_TEAM_INSTRUCTIONS.title,
      text: typeof text === "string" ? text : MASTER_TEAM_INSTRUCTIONS.text,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      updatedAt: new Date().toISOString(),
    };

    ensureInstructionsFile();
    fs.writeFileSync(INSTRUCTIONS_FILE, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({ success: true, instructions: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to save instructions" }, { status: 500 });
  }
}
