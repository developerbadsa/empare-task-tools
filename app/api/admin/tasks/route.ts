import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const TASKS_FILE = path.join(DATA_DIR, "default_tasks.json");

export const INITIAL_DEFAULT_TASKS = [
  {
    id: "task-theme-brand",
    title: "1. Theme & Brand",
    completed: false,
    children: [
      { id: "sub-theme-impulse", title: "Impulse Theme configured", completed: false },
      { id: "sub-logo-name", title: "Logo + Store Name updated", completed: false },
      { id: "sub-favicon", title: "Favicon uploaded & verified", completed: false },
      { id: "sub-brand-colors", title: "Brand Colors set", completed: false },
    ],
  },
  {
    id: "task-checkout",
    title: "2. Checkout",
    completed: false,
    children: [
      { id: "sub-checkout-logo", title: "Checkout Logo placed", completed: false },
      { id: "sub-checkout-color", title: "Checkout Brand Accent Color matched", completed: false },
      { id: "sub-checkout-title", title: "Checkout Title & Branding verified", completed: false },
    ],
  },
  {
    id: "task-pages",
    title: "3. Pages",
    completed: false,
    children: [
      { id: "sub-pages-translation", title: "Natural local-language translation", completed: false },
      { id: "sub-pages-credentials", title: "Correct Company / Contact / Address aligned", completed: false },
      { id: "sub-pages-no-insta", title: "No unnecessary Instagram repetition", completed: false },
    ],
  },
  {
    id: "task-shipping",
    title: "4. Shipping",
    completed: false,
    children: [
      { id: "sub-shipping-free", title: "Free Express Shipping translated to local language", completed: false },
      { id: "sub-shipping-consistent", title: "Store-wide free shipping consistency verified", completed: false },
    ],
  },
  {
    id: "task-tracking-parcel",
    title: "5. Tracking & Parcel Panel",
    isCritical: true,
    completed: false,
    children: [
      { id: "sub-parcel-panel-config", title: "Parcel Panel configured", completed: false },
      { id: "sub-tracking-page-live", title: "Tracking Page configured & live", completed: false },
      { id: "sub-shipment-statuses", title: "Custom Shipment Statuses set (3, 6, 9 days)", completed: false },
      { id: "sub-tracking-url-works", title: "Tracking URL works & manually tested", completed: false },
    ],
  },
  {
    id: "task-cwill-removal",
    title: "6. CWILL Removal",
    isCritical: true,
    completed: false,
    children: [
      { id: "sub-remove-cwill", title: "Remove Powered by CWILL branding", completed: false },
      { id: "sub-contact-support", title: "Contact support if needed", completed: false },
      { id: "sub-confirm-store", title: "Correct store confirmed", completed: false },
      { id: "sub-recheck-cwill", title: "Re-check storefront after removal", completed: false },
    ],
  },
  {
    id: "task-product-page",
    title: "7. Product Page",
    completed: false,
    children: [
      { id: "sub-payment-logos", title: "Local payment logos placed correctly", completed: false },
      { id: "sub-clean-alignment", title: "Clean alignment & minimal layout", completed: false },
      { id: "sub-do-not-remove", title: "Do not remove elements without instruction", completed: false },
    ],
  },
  {
    id: "task-cookie-banner",
    title: "8. Cookie Banner",
    completed: false,
    children: [
      { id: "sub-cookie-remove", title: "Cookie Banner removed", completed: false },
      { id: "sub-test-storefront", title: "Test storefront clean view", completed: false },
    ],
  },
  {
    id: "task-collections",
    title: "9. Collections",
    completed: false,
    children: [
      { id: "sub-collection-tags", title: "Add tag conditions matching Collection names", completed: false },
    ],
  },
  {
    id: "task-final-qa",
    title: "10. Final QA & Review",
    isCritical: true,
    completed: false,
    children: [
      { id: "sub-sequential-check", title: "Sequential check: Theme, Checkout, Pages, Shipping, Tracking, CWILL, Payment Logos, Cookie", completed: false },
      { id: "sub-final-test-order", title: "Perform final live test checkout order", completed: false },
    ],
  },
];

function ensureTasksFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(TASKS_FILE)) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(INITIAL_DEFAULT_TASKS, null, 2), "utf-8");
  }
}

export async function GET() {
  try {
    ensureTasksFile();
    const raw = fs.readFileSync(TASKS_FILE, "utf-8");
    const tasks = JSON.parse(raw || "[]");
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

    ensureTasksFile();
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), "utf-8");

    return NextResponse.json({ success: true, tasks });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to save tasks" }, { status: 500 });
  }
}
