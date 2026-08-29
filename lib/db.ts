import { MongoClient, Db } from "mongodb";
import fs from "fs";
import path from "path";
import os from "os";

// Initial fallback constants
export const MASTER_TEAM_INSTRUCTIONS = {
  title: "PM Notice",
  text: `• Title, description and image obossoy professional hoite hobe.\n• Jodi kuno store a 60 days thake seyta replace kore 30 days korte hobe.\n• Monday te Done dewua thaka store a login/edit korar dorkar nai.`,
  isActive: true,
  updatedAt: new Date().toISOString(),
};

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
    id: "task-tracking-parcel-cwill",
    title: "5. Tracking / Parcel Panel & CWILL",
    isCritical: true,
    completed: false,
    children: [
      { id: "sub-parcel-panel-config", title: "Parcel Panel configured & live", completed: false },
      { id: "sub-shipment-statuses", title: "Custom Shipment Statuses set (3, 6, 9 days)", completed: false },
      { id: "sub-blacklist-keywords", title: "Filter Keywords added to settings", completed: false },
      { id: "sub-tracking-url-works", title: "Tracking URL tested & working", completed: false },
      { id: "sub-remove-cwill", title: "Remove Powered by CWILL branding", completed: false },
      { id: "sub-contact-support", title: "Contacted CWILL live support", completed: false },
      { id: "sub-confirm-store", title: "Correct store confirmed with support", completed: false },
      { id: "sub-recheck-cwill", title: "Re-check storefront after removal", completed: false },
    ],
  },
  {
    id: "task-product-page",
    title: "6. Product Page",
    completed: false,
    children: [
      { id: "sub-payment-logos", title: "Local payment logos placed correctly", completed: false },
      { id: "sub-clean-alignment", title: "Clean alignment & minimal layout", completed: false },
      { id: "sub-do-not-remove", title: "Do not remove elements without instruction", completed: false },
    ],
  },
  {
    id: "task-cookie-banner",
    title: "7. Cookie Banner",
    completed: false,
    children: [
      { id: "sub-cookie-remove", title: "Cookie Banner removed", completed: false },
      { id: "sub-test-storefront", title: "Test storefront clean view", completed: false },
    ],
  },
  {
    id: "task-collections",
    title: "8. Collections",
    completed: false,
    children: [
      { id: "sub-collection-tags", title: "Add tag conditions matching Collection names", completed: false },
    ],
  },
  {
    id: "task-final-qa",
    title: "9. Final QA & Review",
    isCritical: true,
    completed: false,
    children: [
      { id: "sub-sequential-check", title: "Sequential check: Theme, Checkout, Pages, Shipping, Tracking, CWILL, Payment Logos, Cookie", completed: false },
      { id: "sub-final-test-order", title: "Perform final live test checkout order", completed: false },
    ],
  },
];

// In-Memory global caches for serverless environments when disk is read-only
let memoryUserDb: Record<string, any> = {};
let memoryInstructions: any = null;
let memoryTasks: any = null;

// Paths for local file storage
const LOCAL_DATA_DIR = path.join(process.cwd(), "data");
const TMP_DATA_DIR = path.join(os.tmpdir(), "hk_empire_store_data");

function getStoragePath(fileName: string): string {
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    return path.join(LOCAL_DATA_DIR, fileName);
  } catch (e) {
    // If local dir is read-only (e.g. Vercel serverless), fall back to OS temp dir
    try {
      if (!fs.existsSync(TMP_DATA_DIR)) {
        fs.mkdirSync(TMP_DATA_DIR, { recursive: true });
      }
      return path.join(TMP_DATA_DIR, fileName);
    } catch {
      return path.join(os.tmpdir(), fileName);
    }
  }
}

// MongoDB Client Caching
const DEFAULT_MONGODB_URI = "mongodb+srv://rahimbadsa723_db_user:1fLku6MVpqEfW6sB@cluster0.9zpqjli.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const rawUri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
const isValidMongoUri = Boolean(
  rawUri &&
    rawUri.startsWith("mongodb") &&
    !rawUri.includes("<") &&
    !rawUri.includes("cluster-address")
);
const uri = isValidMongoUri ? rawUri : DEFAULT_MONGODB_URI;


let clientPromise: Promise<MongoClient> | null = null;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (uri) {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}


export async function getDb(): Promise<Db | null> {
  if (!clientPromise) return null;
  try {
    const connectedClient = await clientPromise;
    return connectedClient.db(process.env.MONGODB_DB || "empire_store_toolkit");
  } catch (e) {
    console.error("[Database] MongoDB connection failed:", e);
    return null;
  }
}

// --- LOCAL FILE HELPERS (SAFE FALLBACK) ---
function safeReadJson(fileName: string, defaultValue: any): any {
  try {
    // Try local data dir first
    const localPath = path.join(LOCAL_DATA_DIR, fileName);
    if (fs.existsSync(localPath)) {
      const raw = fs.readFileSync(localPath, "utf-8");
      return JSON.parse(raw || "{}");
    }
    // Try tmp path
    const tmpPath = path.join(TMP_DATA_DIR, fileName);
    if (fs.existsSync(tmpPath)) {
      const raw = fs.readFileSync(tmpPath, "utf-8");
      return JSON.parse(raw || "{}");
    }
  } catch (e) {
    // ignore
  }
  return defaultValue;
}

function safeWriteJson(fileName: string, data: any) {
  const filePath = getStoragePath(fileName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    try {
      const fallbackPath = path.join(os.tmpdir(), fileName);
      fs.writeFileSync(fallbackPath, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      // Keep in memory if even tmp fails
    }
  }
}

// --- USER & STORES OPERATIONS ---

export async function getUserData(email: string): Promise<any | null> {
  const cleanEmail = email.trim().toLowerCase();
  const db = await getDb();

  if (db) {
    try {
      const user = await db.collection("users").findOne({ email: cleanEmail });
      if (user) {
        const { _id, ...rest } = user;
        return rest;
      }
      return null;
    } catch (e) {
      console.error("[Database] Failed to fetch user from MongoDB:", e);
    }
  }

  // Fallback to local / memory
  if (memoryUserDb[cleanEmail]) {
    return memoryUserDb[cleanEmail];
  }
  const fileDb = safeReadJson("user_stores.json", {});
  if (fileDb[cleanEmail]) {
    memoryUserDb[cleanEmail] = fileDb[cleanEmail];
    return fileDb[cleanEmail];
  }
  return null;
}

export async function saveUserData(data: {
  email: string;
  name?: string;
  stores?: any[];
  activeId?: string;
  customPrompts?: Record<string, string>;
  tasks?: Record<string, any>;
}): Promise<any> {
  const cleanEmail = data.email.trim().toLowerCase();
  const db = await getDb();
  const now = new Date().toISOString();

  const userRecord = {
    email: cleanEmail,
    name: data.name || "",
    stores: data.stores || [],
    activeId: data.activeId || "",
    customPrompts: data.customPrompts || {},
    tasks: data.tasks || {},
    updatedAt: now,
  };

  if (db) {
    try {
      await db.collection("users").updateOne(
        { email: cleanEmail },
        {
          $set: {
            name: userRecord.name,
            stores: userRecord.stores,
            activeId: userRecord.activeId,
            customPrompts: userRecord.customPrompts,
            tasks: userRecord.tasks,
            updatedAt: now,
          },
          $setOnInsert: { email: cleanEmail },
        },
        { upsert: true }
      );
      return userRecord;
    } catch (e) {
      console.error("[Database] Failed to save user to MongoDB:", e);
    }
  }

  // Fallback to local / memory
  memoryUserDb[cleanEmail] = userRecord;
  try {
    const fileDb = safeReadJson("user_stores.json", {});
    fileDb[cleanEmail] = userRecord;
    safeWriteJson("user_stores.json", fileDb);
  } catch (e) {}

  return userRecord;
}

export async function getAllUsers(): Promise<any[]> {
  const db = await getDb();

  if (db) {
    try {
      const users = await db.collection("users").find({}).sort({ updatedAt: -1 }).toArray();
      return users.map((u) => ({
        name: u.name || "Unnamed",
        email: u.email || "",
        stores: u.stores || [],
        activeId: u.activeId || "",
        updatedAt: u.updatedAt || "",
      }));
    } catch (e) {
      console.error("[Database] Failed to fetch users from MongoDB:", e);
    }
  }

  // Fallback to local / memory
  const fileDb = safeReadJson("user_stores.json", {});
  return Object.values(fileDb).map((u: any) => ({
    name: u.name || "Unnamed",
    email: u.email || "",
    stores: u.stores || [],
    activeId: u.activeId || "",
    updatedAt: u.updatedAt || "",
  }));
}


export async function deleteUser(email: string): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();
  const db = await getDb();

  if (db) {
    try {
      await db.collection("users").deleteOne({ email: cleanEmail });
    } catch (e) {
      console.error("[Database] Failed to delete user from MongoDB:", e);
    }
  }

  delete memoryUserDb[cleanEmail];
  try {
    const fileDb = safeReadJson("user_stores.json", {});
    delete fileDb[cleanEmail];
    safeWriteJson("user_stores.json", fileDb);
  } catch (e) {}

  return true;
}

export async function deleteUserStore(email: string, storeId: string): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();
  const db = await getDb();

  if (db) {
    try {
      await db.collection("users").updateOne(
        { email: cleanEmail },
        { $pull: { stores: { id: storeId } } } as any
      );
    } catch (e) {
      console.error("[Database] Failed to delete store from MongoDB:", e);
    }
  }

  if (memoryUserDb[cleanEmail] && Array.isArray(memoryUserDb[cleanEmail].stores)) {
    memoryUserDb[cleanEmail].stores = memoryUserDb[cleanEmail].stores.filter((s: any) => s.id !== storeId);
  }
  try {
    const fileDb = safeReadJson("user_stores.json", {});
    if (fileDb[cleanEmail] && Array.isArray(fileDb[cleanEmail].stores)) {
      fileDb[cleanEmail].stores = fileDb[cleanEmail].stores.filter((s: any) => s.id !== storeId);
      safeWriteJson("user_stores.json", fileDb);
    }
  } catch (e) {}

  return true;
}



// --- ADMIN INSTRUCTIONS OPERATIONS ---

export async function getAdminInstructions(): Promise<any> {
  const db = await getDb();

  if (db) {
    try {
      const doc = await db.collection("settings").findOne({ key: "admin_instructions" });
      if (doc && doc.text) {
        return {
          title: doc.title || MASTER_TEAM_INSTRUCTIONS.title,
          text: doc.text,
          isActive: doc.isActive !== undefined ? doc.isActive : true,
          updatedAt: doc.updatedAt || MASTER_TEAM_INSTRUCTIONS.updatedAt,
        };
      }
      // Seed default instructions into MongoDB
      const fileData = safeReadJson("admin_instructions.json", MASTER_TEAM_INSTRUCTIONS);
      const seedData = fileData.text ? fileData : MASTER_TEAM_INSTRUCTIONS;
      await db.collection("settings").updateOne(
        { key: "admin_instructions" },
        { $set: { ...seedData } },
        { upsert: true }
      );
      return seedData;
    } catch (e) {
      console.error("[Database] Failed to fetch instructions from MongoDB:", e);
    }
  }

  if (memoryInstructions) return memoryInstructions;
  const fileData = safeReadJson("admin_instructions.json", null);
  if (fileData && fileData.text) {
    memoryInstructions = fileData;
    return fileData;
  }
  return MASTER_TEAM_INSTRUCTIONS;
}


export async function saveAdminInstructions(data: {
  title?: string;
  text?: string;
  isActive?: boolean;
}): Promise<any> {
  const updated = {
    title: data.title || MASTER_TEAM_INSTRUCTIONS.title,
    text: typeof data.text === "string" ? data.text : MASTER_TEAM_INSTRUCTIONS.text,
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    updatedAt: new Date().toISOString(),
  };

  const db = await getDb();
  if (db) {
    try {
      await db.collection("settings").updateOne(
        { key: "admin_instructions" },
        { $set: { ...updated } },
        { upsert: true }
      );
      return updated;
    } catch (e) {
      console.error("[Database] Failed to save instructions to MongoDB:", e);
    }
  }

  memoryInstructions = updated;
  safeWriteJson("admin_instructions.json", updated);
  return updated;
}

// --- MASTER TASKS OPERATIONS ---

export async function getMasterTasks(): Promise<any[]> {
  const db = await getDb();

  if (db) {
    try {
      const doc = await db.collection("settings").findOne({ key: "master_tasks" });
      if (doc && Array.isArray(doc.tasks) && doc.tasks.length > 0) {
        return doc.tasks;
      }
      // Seed default tasks into MongoDB
      const fileTasks = safeReadJson("default_tasks.json", INITIAL_DEFAULT_TASKS);
      const seedTasks = Array.isArray(fileTasks) && fileTasks.length > 0 ? fileTasks : INITIAL_DEFAULT_TASKS;
      await db.collection("settings").updateOne(
        { key: "master_tasks" },
        { $set: { tasks: seedTasks, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
      return seedTasks;
    } catch (e) {
      console.error("[Database] Failed to fetch master tasks from MongoDB:", e);
    }
  }

  if (memoryTasks && Array.isArray(memoryTasks) && memoryTasks.length > 0) return memoryTasks;
  const fileTasks = safeReadJson("default_tasks.json", []);
  if (Array.isArray(fileTasks) && fileTasks.length > 0) {
    memoryTasks = fileTasks;
    return fileTasks;
  }
  return INITIAL_DEFAULT_TASKS;
}


export async function saveMasterTasks(tasks: any[]): Promise<any[]> {
  const db = await getDb();

  if (db) {
    try {
      await db.collection("settings").updateOne(
        { key: "master_tasks" },
        { $set: { tasks: tasks, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
      return tasks;
    } catch (e) {
      console.error("[Database] Failed to save master tasks to MongoDB:", e);
    }
  }

  memoryTasks = tasks;
  safeWriteJson("default_tasks.json", tasks);
  return tasks;
}
