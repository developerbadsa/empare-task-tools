import { NextRequest, NextResponse } from "next/server";
import { getMasterTasks, saveMasterTasks, INITIAL_DEFAULT_TASKS } from "@/lib/db";

export async function GET() {
  try {
    const tasks = await getMasterTasks();
    return NextResponse.json({ success: true, tasks: tasks.length > 0 ? tasks : INITIAL_DEFAULT_TASKS });
  } catch (e: any) {
    return NextResponse.json({ success: true, tasks: INITIAL_DEFAULT_TASKS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tasks = body.tasks;

    if (!Array.isArray(tasks)) {
      return NextResponse.json({ error: "Invalid tasks array" }, { status: 400 });
    }

    const saved = await saveMasterTasks(tasks);
    return NextResponse.json({ success: true, tasks: saved });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to save tasks" }, { status: 500 });
  }
}

