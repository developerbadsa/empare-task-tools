"use client";
import { useState, useEffect } from "react";
import {
  Store,
  Plus,
  Copy,
  Check,
  Trash2,
  Pencil,
  AlertTriangle,
  User,
  ListTodo,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  RotateCcw,
  Megaphone,
  ExternalLink,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserProfile {
  name: string;
  email: string;
}

export interface TaskSubItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  isCritical?: boolean;
  completed: boolean;
  children?: TaskSubItem[];
}

export interface StoreData {
  id: string;
  name: string;
  company: string;
  address: string;
  email: string;
  domain: string;
  country: string;
  language: string;
  currency: string;
  hours: string;
  notes?: string;
  rememberOptions?: string[];
}

const DEFAULT_STORE_TASKS: TaskItem[] = [
  {
    id: "task-theme-brand",
    title: "1. Theme & Brand",
    completed: false,
    children: [
      { id: "sub-theme-impulse", title: "Impulse Theme configured", completed: false },
      { id: "sub-logo-name", title: "Logo and Store Name updated", completed: false },
      { id: "sub-favicon", title: "Favicon uploaded and verified", completed: false },
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
      { id: "sub-checkout-title", title: "Checkout Title and Branding verified", completed: false },
    ],
  },
  {
    id: "task-pages",
    title: "3. Pages",
    completed: false,
    children: [
      { id: "sub-pages-translation", title: "Natural local-language translation", completed: false },
      { id: "sub-pages-credentials", title: "Company, Contact, and Address aligned", completed: false },
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
      { id: "sub-clean-alignment", title: "Clean alignment and minimal layout", completed: false },
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

const DEFAULT_REMEMBER_PRESETS = [
  { id: "free_shipping", label: "Shipping always free", defaultChecked: true },
  { id: "verify_payment", label: "Verify payment methods are available in country", defaultChecked: true },
  { id: "replace_branding", label: "Logo and brand name must replace ALL reference brand info", defaultChecked: true },
  { id: "no_china", label: "Check parcel keys (China references)", defaultChecked: false },
  { id: "currency_format", label: "Use correct currency format for country", defaultChecked: false },
  { id: "language_local", label: "Write in natural local language (not word-for-word)", defaultChecked: false },
];

const getDefaultChecked = (presets: { label: string; defaultChecked: boolean }[]) => presets.filter((p) => p.defaultChecked).map((p) => p.label);

const emptyStore: StoreData = {
  id: "",
  name: "",
  company: "",
  address: "",
  email: "",
  domain: "",
  country: "",
  language: "",
  currency: "",
  hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
  rememberOptions: [...getDefaultChecked(DEFAULT_REMEMBER_PRESETS)],
  notes: "",
};

const DEFAULT_STORES: StoreData[] = [
  {
    id: "poland-luminari",
    name: "Luminari",
    company: "Luminari sp. z o.o.",
    address: "ul. Chorzowska 107, 40-101 Katowice, Polska",
    email: "pomoc@luminarikatowice.com",
    domain: "luminarikatowice.com",
    country: "Poland",
    language: "Polish",
    currency: "PLN",
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    rememberOptions: [
      "Shipping always free",
      "Verify payment methods are available in country",
      "Logo and brand name must replace ALL reference brand info",
    ],
    notes: "",
  },
  {
    id: "denmark-luminari",
    name: "Luminari",
    company: "Luminari ApS",
    address: "Østergade 12, 1100 København K, Danmark",
    email: "support@luminari.dk",
    domain: "luminari.dk",
    country: "Denmark",
    language: "Danish",
    currency: "DKK",
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    rememberOptions: [
      "Shipping always free",
      "Verify payment methods are available in country",
      "Logo and brand name must replace ALL reference brand info",
    ],
    notes: "",
  },
];

const DYNAMIC_TAGS = [
  { tag: "{STORE_NAME}", label: "Store Name", desc: "e.g. Luminari" },
  { tag: "{COUNTRY}", label: "Country", desc: "e.g. Poland" },
  { tag: "{COMPANY}", label: "Company", desc: "e.g. Luminari sp. z o.o." },
  { tag: "{DOMAIN}", label: "Domain", desc: "e.g. luminarikatowice.com" },
  { tag: "{EMAIL}", label: "Email", desc: "e.g. pomoc@luminarikatowice.com" },
  { tag: "{LANGUAGE}", label: "Language", desc: "e.g. Polish" },
  { tag: "{CURRENCY}", label: "Currency", desc: "e.g. PLN" },
  { tag: "{ADDRESS}", label: "Address", desc: "e.g. ul. Chorzowska 107..." },
  { tag: "{HOURS}", label: "Hours", desc: "e.g. Monday–Friday..." },
];

const DEFAULT_RAW_TEMPLATES = [
  {
    id: "image-transform",
    title: "Image Transform",
    rawText:
      "Act as an expert e-commerce visual director. Transform the attached reference image into a new photorealistic, high-end commercial photo for **{STORE_NAME}** ({COUNTRY}).\n\n" +
      "MANDATORY STRICT RULES:\n" +
      "1. COMPLETE BRAND REMOVAL: Detect and 100% remove all reference logos, brand names, watermarks, tags, Asian/Chinese text, and promotional labels. Replace with clean unbranded or {STORE_NAME} styling.\n" +
      "2. NATURAL DEMOGRAPHIC: Completely replace the person in the reference with a new natural-looking model native to **{COUNTRY}** (matching realistic European/Scandinavian facial features, natural skin tone, hair styling, eye color, and cultural fashion).\n" +
      "3. AUTHENTIC ENVIRONMENT: Replace the background with an authentic, modern setting matching **{COUNTRY}** (clean minimalist Scandinavian interior or exterior, warm natural lighting, summer ambiance if seasonal).\n" +
      "4. PRODUCT & FIDELITY: Keep the exact product shape, composition, camera angle, pose, framing, and true-to-life texture unchanged.\n" +
      "5. ZERO UNWANTED TEXT / NO CGI: Do NOT invent or add any random floating text, badges, or CGI artifacts. Keep output 100% photorealistic, crisp, and studio-grade.",
  },
  {
    id: "logo-generator",
    title: "Logo",
    rawText:
      "Act as a master typography and brand identity designer. Analyze the attached reference logo image and generate a new high-resolution logo for **{STORE_NAME}** that perfectly replicates the reference logo's exact design language and typography.\n\n" +
      "STRICT SPECIFICATIONS:\n" +
      "1. TARGET LOGO TEXT: The new logo must strictly read: **{STORE_NAME}**\n" +
      "2. TYPOGRAPHY & WEIGHT: Perfectly mirror the font family, font weight, letter thickness, and kerning (letter-spacing) from the reference logo.\n" +
      "3. CASE SENSITIVITY: Match the exact capitalization style from the reference logo (ALL CAPS, Title Case, or lowercase).\n" +
      "4. COLOR & ASPECT RATIO: Match the exact color scheme, contrast ratio, and scale from the reference logo.\n" +
      "5. CLEAN VECTOR FINISH: Deliver a razor-sharp, pixel-perfect logo centered on a pure transparent or solid white background with ZERO background noise, zero decorative clutter, and no extra text.",
  },
  {
    id: "page-guide",
    title: "Page Guide",
    rawText:
      "When I give you a reference page, naturally translate, structure, and adapt it for **{STORE_NAME}** ({COUNTRY}) using the official store credentials below.\n\n" +
      "**STORE CREDENTIALS:**\n" +
      "- Store Name: {STORE_NAME}\n" +
      "- Company Legal Name: {COMPANY}\n" +
      "- Registered Address: {ADDRESS}\n" +
      "- Customer Support Email: {EMAIL}\n" +
      "- Website Domain: {DOMAIN}\n" +
      "- Service Hours: {HOURS}\n" +
      "- Target Language: {LANGUAGE}\n" +
      "- Target Country: {COUNTRY}\n" +
      "- Currency: {CURRENCY}\n\n" +
      "**STRICT RULES:**\n" +
      "1. 100% BRAND REPLACEMENT: Replace EVERY reference brand name, entity, email, domain, phone, and address with my store data above.\n" +
      "2. NO INVENTING DATA: If any data is not present in the reference text, SKIP it cleanly. Never hallucinate or invent fake phone numbers or addresses.\n" +
      "3. NATIVE LOCALIZATION: Write in natural, idiomatic local **{LANGUAGE}** as spoken by real native speakers in **{COUNTRY}** (strictly no robotic word-for-word translation).\n" +
      "4. STANDARD HIERARCHY: Format headings with **26px** and body paragraphs with **14px**.\n" +
      "5. COUNTRY VERIFICATION: Verify all payment methods (e.g. BLIK/Przelewy24 for Poland, MobilePay for Denmark), shipping, currencies, and taxes belong strictly to **{COUNTRY}**. Automatically remove options from other countries.",
  },
  {
    id: "translate-text",
    title: "Translate Text",
    rawText:
      "Act as an expert native translator and e-commerce copywriter for **{STORE_NAME}** in **{COUNTRY}**.\n\n" +
      "When I give you text in any language:\n" +
      "1. BRAND CLEANUP: Remove all reference brand names, logos, or URLs and replace with **{STORE_NAME}** info (skip unavailable details, do not invent anything).\n" +
      "2. NATIVE CONTEXT: First understand the commercial meaning in English internally, then translate into fluent, authentic, native local **{LANGUAGE}** tailored for **{STORE_NAME}** in **{COUNTRY}**.\n" +
      "3. COPY QUALITY: Keep the tone natural, simple, and trustworthy, matching native e-commerce standards. No literal word-for-word translation.\n" +
      "4. FORMATTED OUTPUT: Show the original input and English meaning in a clean comparison table, followed by each translated section separately in its own copyable code block for effortless 1-click copying.",
  },
  {
    id: "currency",
    title: "Currency",
    rawText:
      "{CURRENCY_FORMAT}",
  },
  {
    id: "parcel-cwill",
    title: "Parcel & CWILL",
    rawText:
      "Act as a Shopify technical specialist. Follow and execute the mandatory Parcel Panel & CWILL configuration directives for **{STORE_NAME}** ({DOMAIN}):\n\n" +
      "1. PARCEL PANEL TRACKING SETUP:\n" +
      "   • Verify that Parcel Panel tracking is installed and live on {DOMAIN}.\n" +
      "   • Configure the 3 Custom Shipment Statuses:\n" +
      "     - Day 3 (Warehouse Processing): \"Your order is currently being processed in our warehouse.\"\n" +
      "     - Day 6 (Order Queued for Dispatch): \"Due to high demand, your order is scheduled for dispatch.\"\n" +
      "     - Day 9 (Preparing Shipment): \"Your order is being prepared for handover to the carrier.\"\n" +
      "   • Manually test tracking with a sample number to confirm working URL.\n\n" +
      "2. BLACKLISTED KEYWORDS FILTER (100% Removed):\n" +
      "   • Ensure tracking updates contain zero mentions of: China, Made in China, Chinese, China origin, Manufactured in China, Shenzhen, Factory direct, Chinese supplier, AliExpress, AliBaba, Taobao, Global Sources, Dropshipping, Wholesale China, Direct from China, Chinese factory, Chinese goods, China wholesale, JD.com, Tmall, 1688.com, Pinduoduo, Gearbest, DHgate, Banggood, Chinese cities.\n\n" +
      "3. REMOVE \"POWERED BY CWILL\" BRANDING:\n" +
      "   • Open the CWILL support chat in the bottom-right corner of the app dashboard.\n" +
      "   • Request: \"Please remove the 'Powered by CWILL' branding badge for store: {DOMAIN} ({STORE_NAME}).\"\n" +
      "   • Confirm store URL when requested (badge is removed within 1–2 hours).\n" +
      "   • Re-check the live storefront after removal to verify clean appearance.\n\n" +
      "4. REFERENCE DIRECTORY:\n" +
      "   • Google Sheet: https://docs.google.com/spreadsheets/d/1KDjoXEFPyezZoG9Cxvgn1LTNBrRrKmKoLjQd963BVSs/edit?gid=2016016033#gid=2016016033",
  },
];

function renderTemplate(rawText: string, st: StoreData | null): string {
  if (!st || !st.name) return "";

  let currencyFormat = "";
  if (st.currency === "DKK") {
    currencyFormat =
      "Denmark Market Currency Formatting:\n" +
      "HTML with currency: {{amount_with_comma_separator}} DKK\n" +
      "HTML without currency: {{amount_with_comma_separator}} kr\n" +
      "Email with currency: {{amount_with_comma_separator}} DKK\n" +
      "Email without currency: {{amount_with_comma_separator}} kr\n\n" +
      "Use these exact formats in all " + st.name + " templates for " + st.country + ".";
  } else {
    currencyFormat =
      "Poland Market Currency Formatting:\n" +
      "Use PLN for all currency displays.\n\n" +
      "Apply proper Polish formatting for " + st.name + " (" + st.country + ").";
  }

  return rawText
    .replace(/\{STORE_NAME\}/g, st.name || "")
    .replace(/\{COUNTRY\}/g, st.country || "")
    .replace(/\{COMPANY\}/g, st.company || "")
    .replace(/\{DOMAIN\}/g, st.domain || "")
    .replace(/\{EMAIL\}/g, st.email || "")
    .replace(/\{LANGUAGE\}/g, st.language || "")
    .replace(/\{CURRENCY\}/g, st.currency || "")
    .replace(/\{ADDRESS\}/g, st.address || "")
    .replace(/\{HOURS\}/g, st.hours || "")
    .replace(/\{CURRENCY_FORMAT\}/g, currencyFormat);
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [userForm, setUserForm] = useState({ name: "", email: "" });
  const [showUserModal, setShowUserModal] = useState(false);

  const [stores, setStores] = useState<StoreData[]>([]);
  const [activeId, setActiveId] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<StoreData>({ ...emptyStore });
  const [isLoaded, setIsLoaded] = useState(false);

  // Custom prompt overrides per template ID (e.g. { "image-transform": "..." })
  const [customPrompts, setCustomPrompts] = useState<Record<string, string>>({});
  const [editingPrompt, setEditingPrompt] = useState<{ id: string; title: string; rawText: string } | null>(null);

  // Store Workflow Tasks per Store ID
  const [storeTasks, setStoreTasks] = useState<Record<string, TaskItem[]>>({});
  const [collapsedTasks, setCollapsedTasks] = useState<Record<string, boolean>>({});
  const [newTaskInput, setNewTaskInput] = useState("");

  // Admin Global Instructions
  const [adminInstructions, setAdminInstructions] = useState<{
    title: string;
    text: string;
    isActive: boolean;
  } | null>(null);
  const [showAdminNotice, setShowAdminNotice] = useState(true);

  // Editable Things to Remember presets
  const [rememberPresets, setRememberPresets] = useState(DEFAULT_REMEMBER_PRESETS);
  const [editingPreset, setEditingPreset] = useState<{ id: string; label: string } | null>(null);
  const [newPresetLabel, setNewPresetLabel] = useState("");
  const [showPresetEditor, setShowPresetEditor] = useState(false);

  // 1. Check user profile on initial load and fetch admin instructions
  useEffect(() => {
    fetch("/api/admin/instructions")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.instructions) {
          setAdminInstructions(data.instructions);
        }
      })
      .catch(() => {});

    // Load editable presets from localStorage
    try {
      const savedPresets = localStorage.getItem("store_toolkit_remember_presets");
      if (savedPresets) {
        const parsed = JSON.parse(savedPresets);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRememberPresets(parsed);
        }
      }
    } catch (e) {}

    // Check persistent user profile (localStorage + Cookie)
    let foundProfile = false;
    try {
      let savedUser = localStorage.getItem("store_toolkit_current_user");
      if (!savedUser && typeof document !== "undefined") {
        const match = document.cookie.match(/(?:^|;\s*)store_toolkit_user=([^;]+)/);
        if (match && match[1]) {
          savedUser = decodeURIComponent(match[1]);
        }
      }
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.email) {
          setCurrentUser(parsedUser);
          setShowUserModal(false);
          loadUserData(parsedUser.email);
          foundProfile = true;
        }
      }
    } catch (e) {}

    // Only show modal if user has NEVER registered before
    if (!foundProfile) {
      setShowUserModal(true);
    }
    setIsLoaded(true);
  }, []);

  async function loadUserData(email: string) {
    const cleanEmail = email.trim().toLowerCase();
    const storageKey = "store_toolkit_data_" + cleanEmail;
    const promptsKey = "store_toolkit_prompts_" + cleanEmail;
    const tasksKey = "store_toolkit_tasks_" + cleanEmail;
    
    // First try fast local cache
    let foundLocal = false;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.stores && d.stores.length > 0) {
          const cleanedStores = d.stores.map((s: StoreData) => ({
            ...s,
            rememberOptions: s.rememberOptions || [...getDefaultChecked(rememberPresets)],
          }));
          setStores(cleanedStores);
          setActiveId(d.activeId || cleanedStores[0].id);
          foundLocal = true;
        }
      }
      const savedPrompts = localStorage.getItem(promptsKey);
      if (savedPrompts) {
        setCustomPrompts(JSON.parse(savedPrompts));
      }
      const savedTasks = localStorage.getItem(tasksKey);
      if (savedTasks) {
        setStoreTasks(JSON.parse(savedTasks));
      }
    } catch (e) {}

    // Then sync with server backend database
    try {
      const res = await fetch("/api/stores?email=" + encodeURIComponent(cleanEmail));
      const data = await res.json();
      if (data.success && data.userData) {
        if (data.userData.stores && data.userData.stores.length > 0) {
          const serverStores = data.userData.stores.map((s: StoreData) => ({
            ...s,
            rememberOptions: s.rememberOptions || [...getDefaultChecked(rememberPresets)],
          }));
          setStores(serverStores);
          setActiveId(data.userData.activeId || serverStores[0].id);
          localStorage.setItem(storageKey, JSON.stringify({ stores: serverStores, activeId: data.userData.activeId || serverStores[0].id }));
        }
        if (data.userData.customPrompts) {
          setCustomPrompts(data.userData.customPrompts);
          localStorage.setItem(promptsKey, JSON.stringify(data.userData.customPrompts));
        }
        if (data.userData.tasks) {
          setStoreTasks(data.userData.tasks);
          localStorage.setItem(tasksKey, JSON.stringify(data.userData.tasks));
        }
        return;
      }
    } catch (e) {}

    // If no data exists anywhere yet, initialize with default starting stores for this user
    if (!foundLocal) {
      setStores(DEFAULT_STORES);
      setActiveId(DEFAULT_STORES[0].id);
      localStorage.setItem(storageKey, JSON.stringify({ stores: DEFAULT_STORES, activeId: DEFAULT_STORES[0].id }));
      syncToServer(currentUser?.name || "", cleanEmail, DEFAULT_STORES, DEFAULT_STORES[0].id, {}, {});
    }
  }

  function syncToServer(
    name: string,
    email: string,
    currentStores: StoreData[],
    currentActiveId: string,
    currentPrompts?: Record<string, string>,
    currentTasks?: Record<string, TaskItem[]>
  ) {
    if (!email) return;
    try {
      fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email.trim().toLowerCase(),
          stores: currentStores,
          activeId: currentActiveId,
          customPrompts: currentPrompts !== undefined ? currentPrompts : customPrompts,
          tasks: currentTasks !== undefined ? currentTasks : storeTasks,
        }),
      }).catch(() => {});
    } catch (e) {}
  }

  // 2. Persist store data under the user's isolated storage key
  useEffect(() => {
    if (!isLoaded || !currentUser) return;
    try {
      const storageKey = "store_toolkit_data_" + currentUser.email.trim().toLowerCase();
      localStorage.setItem(storageKey, JSON.stringify({ stores, activeId }));
      syncToServer(currentUser.name, currentUser.email, stores, activeId, customPrompts, storeTasks);
    } catch (e) {}
  }, [stores, activeId, currentUser, isLoaded]);

  // 2b. Persist editable presets to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("store_toolkit_remember_presets", JSON.stringify(rememberPresets));
    } catch (e) {}
  }, [rememberPresets]);

  // Preset CRUD functions
  function addPreset() {
    if (!newPresetLabel.trim()) return;
    const id = "custom_" + Date.now();
    setRememberPresets([...rememberPresets, { id, label: newPresetLabel.trim(), defaultChecked: false }]);
    setNewPresetLabel("");
  }

  function deletePreset(id: string) {
    if (!confirm("Delete this preset?")) return;
    setRememberPresets(rememberPresets.filter((p) => p.id !== id));
  }

  function togglePresetDefault(id: string) {
    setRememberPresets(rememberPresets.map((p) => p.id === id ? { ...p, defaultChecked: !p.defaultChecked } : p));
  }

  function saveEditedPreset() {
    if (!editingPreset || !editingPreset.label.trim()) return;
    setRememberPresets(rememberPresets.map((p) => p.id === editingPreset.id ? { ...p, label: editingPreset.label.trim() } : p));
    setEditingPreset(null);
  }

  function resetPresetsToDefault() {
    if (!confirm("Reset all presets to default?")) return;
    setRememberPresets(DEFAULT_REMEMBER_PRESETS);
  }

  function handleSaveUser(e: React.FormEvent) {
    e.preventDefault();
    if (!userForm.name.trim() || !userForm.email.trim()) return;

    const profile = { name: userForm.name.trim(), email: userForm.email.trim().toLowerCase() };
    setCurrentUser(profile);
    localStorage.setItem("store_toolkit_current_user", JSON.stringify(profile));
    try {
      document.cookie = `store_toolkit_user=${encodeURIComponent(JSON.stringify(profile))}; path=/; max-age=315360000; SameSite=Lax`;
    } catch (e) {}
    setShowUserModal(false);
    loadUserData(profile.email);
  }

  function handleSwitchUser() {
    setUserForm({ name: currentUser?.name || "", email: currentUser?.email || "" });
    setShowUserModal(true);
  }

  var active = stores.find(function(s) { return s.id === activeId; }) || null;
  var templates = DEFAULT_RAW_TEMPLATES.map(function(t) {
    var rawText = customPrompts[t.id] !== undefined ? customPrompts[t.id] : t.rawText;
    var renderedText = renderTemplate(rawText, active);
    return {
      id: t.id,
      title: t.title,
      rawText: rawText,
      text: renderedText,
      isCustom: customPrompts[t.id] !== undefined,
    };
  });

  // Task Checklist Helpers
  function getActiveTasks(): TaskItem[] {
    if (!activeId) return DEFAULT_STORE_TASKS;
    return storeTasks[activeId] || DEFAULT_STORE_TASKS;
  }

  function saveActiveTasks(updatedTasks: TaskItem[]) {
    if (!activeId || !currentUser) return;
    const nextTasks = { ...storeTasks, [activeId]: updatedTasks };
    setStoreTasks(nextTasks);
    const cleanEmail = currentUser.email.trim().toLowerCase();
    localStorage.setItem("store_toolkit_tasks_" + cleanEmail, JSON.stringify(nextTasks));
    syncToServer(currentUser.name, cleanEmail, stores, activeId, customPrompts, nextTasks);
  }

  function toggleTask(taskId: string) {
    const current = getActiveTasks();
    const updated = current.map((t) => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        const nextChildren = t.children?.map((c) => ({ ...c, completed: nextCompleted }));
        return { ...t, completed: nextCompleted, children: nextChildren };
      }
      return t;
    });
    saveActiveTasks(updated);
  }

  function toggleSubTask(parentId: string, subId: string) {
    const current = getActiveTasks();
    const updated = current.map((t) => {
      if (t.id === parentId && t.children) {
        const nextChildren = t.children.map((c) => (c.id === subId ? { ...c, completed: !c.completed } : c));
        const allCompleted = nextChildren.every((c) => c.completed);
        return { ...t, completed: allCompleted, children: nextChildren };
      }
      return t;
    });
    saveActiveTasks(updated);
  }

  function calculateProgress(tasks: TaskItem[]) {
    let total = 0;
    let completed = 0;
    tasks.forEach((t) => {
      if (t.children && t.children.length > 0) {
        t.children.forEach((c) => {
          total++;
          if (c.completed) completed++;
        });
      } else {
        total++;
        if (t.completed) completed++;
      }
    });
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percent };
  }

  function toggleCollapseTask(taskId: string) {
    setCollapsedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  }

  function handleAddCustomTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const current = getActiveTasks();
    const newTask: TaskItem = {
      id: "custom-" + Date.now(),
      title: newTaskInput.trim(),
      completed: false,
    };
    saveActiveTasks([...current, newTask]);
    setNewTaskInput("");
  }

  function resetStoreTasks() {
    if (!confirm("Reset checklist for this store back to default?")) return;
    saveActiveTasks(DEFAULT_STORE_TASKS);
  }

  function addStore() {
    var id = Date.now().toString();
    setStores(stores.concat([{ ...form, id: id }]));
    setActiveId(id);
    setForm({ ...emptyStore, rememberOptions: [...getDefaultChecked(rememberPresets)] });
    setShowForm(false);
  }

  function updateStore() {
    setStores(stores.map(function(s) { return s.id === form.id ? form : s; }));
    setForm({ ...emptyStore, rememberOptions: [...getDefaultChecked(rememberPresets)] });
    setShowForm(false);
  }

  function deleteStore(id: string) {
    if (!confirm("Delete?")) return;
    var next = stores.filter(function(s) { return s.id !== id; });
    setStores(next);
    if (activeId === id) setActiveId(next[0] ? next[0].id : "");
  }

  function editStore(s: StoreData) {
    setForm({
      ...s,
      rememberOptions: s.rememberOptions || [...getDefaultChecked(rememberPresets)],
    });
    setShowForm(true);
  }

  function openEditPromptModal(idx: number) {
    const t = templates[idx];
    if (!t) return;
    setEditingPrompt({ id: t.id, title: t.title, rawText: t.rawText });
  }

  function handleSaveCustomPrompt() {
    if (!editingPrompt || !currentUser) return;
    const nextPrompts = { ...customPrompts, [editingPrompt.id]: editingPrompt.rawText };
    setCustomPrompts(nextPrompts);
    const cleanEmail = currentUser.email.trim().toLowerCase();
    localStorage.setItem("store_toolkit_prompts_" + cleanEmail, JSON.stringify(nextPrompts));
    syncToServer(currentUser.name, cleanEmail, stores, activeId, nextPrompts);
    setEditingPrompt(null);
  }

  function handleResetCustomPrompt() {
    if (!editingPrompt || !currentUser) return;
    const nextPrompts = { ...customPrompts };
    delete nextPrompts[editingPrompt.id];
    setCustomPrompts(nextPrompts);
    const cleanEmail = currentUser.email.trim().toLowerCase();
    localStorage.setItem("store_toolkit_prompts_" + cleanEmail, JSON.stringify(nextPrompts));
    syncToServer(currentUser.name, cleanEmail, stores, activeId, nextPrompts);
    setEditingPrompt(null);
  }

  function handleInsertTag(tag: string) {
    if (!editingPrompt) return;
    const textarea = document.getElementById("promptTextarea") as HTMLTextAreaElement;
    if (!textarea) {
      setEditingPrompt({ ...editingPrompt, rawText: editingPrompt.rawText + " " + tag });
      return;
    }
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const current = editingPrompt.rawText;
    const updated = current.substring(0, start) + tag + current.substring(end);
    setEditingPrompt({ ...editingPrompt, rawText: updated });
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  }

  function copyPrompt(text: string, i: number) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(i);
    setTimeout(function() { setCopiedIdx(null); }, 2000);
  }

  function toggleOption(label: string) {
    const list = form.rememberOptions || [];
    if (list.includes(label)) {
      setForm({ ...form, rememberOptions: list.filter((o) => o !== label) });
    } else {
      setForm({ ...form, rememberOptions: [...list, label] });
    }
  }

  var fields = [
    { key: "name", label: "Store Name", r: true, placeholder: "e.g. Luminari" },
    { key: "company", label: "Company", r: true, placeholder: "e.g. Luminari sp. z o.o." },
    { key: "address", label: "Address", placeholder: "e.g. ul. Chorzowska 107, 40-101 Katowice, Polska" },
    { key: "email", label: "Email", placeholder: "e.g. pomoc@luminarikatowice.com" },
    { key: "domain", label: "Domain", placeholder: "e.g. luminarikatowice.com" },
    { key: "country", label: "Country", r: true, placeholder: "e.g. Poland" },
    { key: "language", label: "Language", r: true, placeholder: "e.g. Polish" },
    { key: "currency", label: "Currency", r: true, placeholder: "e.g. PLN" },
    { key: "hours", label: "Hours", placeholder: "e.g. Monday–Friday, 9:00 a.m.–5:00 p.m." },
  ];

  const [copiedCustom, setCopiedCustom] = useState<string | null>(null);

  function copyCustomText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopiedCustom(key);
    setTimeout(() => setCopiedCustom(null), 2000);
  }

  const currentTasks = getActiveTasks();
  const progress = calculateProgress(currentTasks);
  const activeSubTaskMap = currentTasks.reduce<Record<string, boolean>>((acc, t) => {
    if (t.children) {
      t.children.forEach((c) => {
        acc[c.id] = c.completed;
      });
    }
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-slate-900" strokeWidth={2} />
            <h1 className="text-xl font-bold text-slate-900">Empire Production Hub</h1>
          </div>
          {currentUser && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-[4px] flex items-center gap-1.5 shadow-sm">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentUser.name}</span>
                <span className="text-slate-400">({currentUser.email})</span>
              </span>
              <button
                onClick={handleSwitchUser}
                className="text-xs text-slate-400 hover:text-slate-800 underline"
              >
                Switch
              </button>
            </div>
          )}
        </div>
        <p className="text-sm text-slate-500 mb-5">Select store, pick template, copy, paste in ChatGPT</p>
        
        {/* PM Notice Banner (Green Theme) */}
        {adminInstructions && adminInstructions.isActive && adminInstructions.text && (
          <div className="mb-5 bg-emerald-50/80 border border-emerald-200/90 rounded-[4px] p-3.5 shadow-2xs">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Megaphone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="text-xs font-bold text-emerald-950">
                  {adminInstructions.title || "PM Notice"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowAdminNotice(!showAdminNotice)}
                className="text-[11px] text-emerald-700 hover:text-emerald-950 font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{showAdminNotice ? "Hide" : "Show Notice"}</span>
                {showAdminNotice ? <ChevronUp className="w-3 h-3 text-emerald-700" /> : <ChevronDown className="w-3 h-3 text-emerald-700" />}
              </button>
            </div>

            {showAdminNotice && (
              <div className="text-xs text-emerald-900 leading-relaxed whitespace-pre-wrap font-sans mt-2 pt-2 border-t border-emerald-200/70">
                {adminInstructions.text}
              </div>
            )}
          </div>
        )}

        {/* Store Selector Dropdown & Add Button */}
        <div className="flex items-center gap-2.5 mb-4 flex-wrap">
          {stores.length > 0 && (
            <div className="relative min-w-[240px]">
              <select
                value={activeId}
                onChange={(e) => {
                  setActiveId(e.target.value);
                  setActiveTab(0);
                }}
                className="w-full appearance-none bg-white border border-slate-300 text-slate-800 text-xs font-semibold py-2 pl-3 pr-8 rounded-[4px] shadow-2xs hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer transition-colors"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.country})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          )}

          <button
            onClick={function() {
              setForm({ ...emptyStore, rememberOptions: [...getDefaultChecked(rememberPresets)] });
              setShowForm(true);
            }}
            className="px-3 py-2 rounded-[4px] text-xs font-semibold border border-dashed border-slate-300 text-slate-700 bg-white hover:border-slate-900 hover:text-slate-900 inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} /> Add Store
          </button>
        </div>

        {active && (
          <div className="bg-white border border-slate-200 rounded-[4px] p-4 mb-4">
            <div className="flex items-center gap-3 text-sm text-slate-600 flex-wrap">
              <span className="font-semibold text-slate-900">{active.name}</span>
              <span className="px-2 py-0.5 rounded-[4px] bg-slate-100 text-slate-700 text-xs font-medium">{active.country}</span>
              <span className="text-slate-300">|</span> <span>{active.company}</span>
              <span className="text-slate-300">|</span> <span>{active.domain}</span>
              <span className="text-slate-300">|</span> <span>{active.email}</span>
              <span className="text-slate-300">|</span> <span>{active.language}</span>
              <div className="ml-auto flex items-center gap-1.5">
                <button
                  onClick={function() { editStore(active!); }}
                  className="p-1.5 rounded-[4px] text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Edit Store Details"
                >
                  <Pencil className="w-4 h-4" strokeWidth={2} />
                </button>
                <button
                  onClick={function() { deleteStore(active!.id); }}
                  className="p-1.5 rounded-[4px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Store"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        )}

        {!active && stores.length === 0 && (
          <div className="text-center py-20">
            <Store className="w-10 h-10 text-slate-300 mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-sm text-slate-500 mb-4">No stores yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={function() {
                setForm({ ...emptyStore, rememberOptions: [...getDefaultChecked(rememberPresets)] });
                setShowForm(true);
              }}
            >
              <Plus className="w-4 h-4" strokeWidth={2} /> Add Store
            </Button>
          </div>
        )}

        {active && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Form & Prompts (lg:col-span-7 xl:col-span-8) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              {/* Store Form Inline Section */}
              {showForm && (
                <div className="bg-white border border-slate-200 rounded-[4px] p-6 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 mb-4">{form.id ? "Edit Store" : "Add New Store"}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fields.map(function(f) {
                      return (
                        <div key={f.key}>
                          <label className="block text-xs font-medium text-slate-500 mb-1">
                            {f.label} {f.r && <span className="text-rose-500">*</span>}
                          </label>
                          <input
                            type="text"
                            value={(form as any)[f.key] || ""}
                            onChange={function(e) { setForm({ ...form, [f.key]: e.target.value }); }}
                            placeholder={f.placeholder}
                            className="w-full px-3 py-2 rounded-[4px] border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-950"
                          />
                        </div>
                      );
                    })}

                    {/* Things to Remember Options */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-medium text-slate-500">
                          Things to Remember Options
                        </label>
                        <button
                          type="button"
                          onClick={function() { setShowPresetEditor(!showPresetEditor); }}
                          className="text-[10px] text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
                        >
                          {showPresetEditor ? (
                            "Close Editor"
                          ) : (
                            <>
                              <Settings className="w-3 h-3 text-slate-500" />
                              <span>Manage Presets</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Preset Admin Editor (collapsible) */}
                      {showPresetEditor && (
                        <div className="bg-slate-100 border border-slate-200 rounded-[4px] p-3 mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Manage Presets</span>
                            <button type="button" onClick={resetPresetsToDefault} className="text-[10px] text-slate-400 hover:text-rose-600 cursor-pointer">Reset Default</button>
                          </div>
                          <div className="space-y-1.5 mb-3">
                            {rememberPresets.map(function(opt) {
                              return (
                                <div key={opt.id} className="flex items-center gap-2 bg-white border border-slate-200 rounded-[4px] px-2.5 py-1.5">
                                  {editingPreset && editingPreset.id === opt.id ? (
                                    <input
                                      type="text"
                                      value={editingPreset.label}
                                      onChange={function(e) { setEditingPreset({ ...editingPreset, label: e.target.value }); }}
                                      onKeyDown={function(e) { if (e.key === "Enter") saveEditedPreset(); }}
                                      className="flex-1 px-2 py-0.5 text-xs rounded-[4px] border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
                                      autoFocus
                                    />
                                  ) : (
                                    <span className="flex-1 text-xs text-slate-700 truncate">{opt.label}</span>
                                  )}
                                  <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={opt.defaultChecked}
                                      onChange={function() { togglePresetDefault(opt.id); }}
                                      className="w-3 h-3 accent-slate-900 rounded-[2px]"
                                    />
                                    <span>Default on</span>
                                  </label>
                                  {editingPreset && editingPreset.id === opt.id ? (
                                    <button type="button" onClick={saveEditedPreset} className="text-[10px] text-emerald-600 hover:text-emerald-800 font-bold cursor-pointer">Save</button>
                                  ) : (
                                    <button type="button" onClick={function() { setEditingPreset({ id: opt.id, label: opt.label }); }} className="text-[10px] text-slate-400 hover:text-slate-700 cursor-pointer">Edit</button>
                                  )}
                                  <button type="button" onClick={function() { deletePreset(opt.id); }} className="text-slate-400 hover:text-rose-600 cursor-pointer p-0.5" title="Delete preset">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                          {/* Add new preset */}
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={newPresetLabel}
                              onChange={function(e) { setNewPresetLabel(e.target.value); }}
                              onKeyDown={function(e) { if (e.key === "Enter") addPreset(); }}
                              placeholder="+ Add new preset..."
                              className="flex-1 px-2.5 py-1.5 text-xs rounded-[4px] border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
                            />
                            <button type="button" onClick={addPreset} className="px-3 py-1.5 text-xs font-medium rounded-[4px] bg-slate-900 text-white hover:bg-slate-800 cursor-pointer">Add</button>
                          </div>
                        </div>
                      )}

                      {/* Preset Checkboxes */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 border border-slate-200 rounded-[4px] p-3 mb-3">
                        {rememberPresets.map(function(opt) {
                          const isChecked = (form.rememberOptions || []).includes(opt.label);
                          return (
                            <label
                              key={opt.id}
                              className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={function() { toggleOption(opt.label); }}
                                className="w-3.5 h-3.5 accent-slate-900 rounded-[2px]"
                              />
                              <span>{opt.label}</span>
                            </label>
                          );
                        })}
                      </div>

                      {/* Additional Notes Textarea */}
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Things to Remember (Detailed Notes — Optional)
                      </label>
                      <textarea
                        value={form.notes}
                        onChange={function(e) { setForm({ ...form, notes: e.target.value }); }}
                        rows={4}
                        placeholder={"e.g.\n• Shipping always free\n• USA store cart drawer reference: https://egleboutique.com/ (use same payment icons & cart text)\n• Verify payment methods for the country"}
                        className="w-full px-3 py-2 rounded-[4px] border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-950 resize-none font-mono text-xs leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" size="sm" onClick={function() { setShowForm(false); }}>Cancel</Button>
                    <Button variant="default" size="sm" onClick={form.id ? updateStore : addStore}>{form.id ? "Update" : "Save Store"}</Button>
                  </div>
                </div>
              )}

              {/* Prompt Tabs */}
              <div className="flex flex-wrap gap-2">
                {templates.map(function(t, i) {
                  return (
                    <button
                      key={i}
                      onClick={function() { setActiveTab(i); }}
                      className={"px-3 py-1.5 rounded-[4px] text-xs font-medium border transition-colors flex items-center gap-1.5 " + (activeTab === i ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400")}
                    >
                      <span>{t.title}</span>
                      {t.isCustom && <span className="w-1.5 h-1.5 rounded-full bg-sky-400" title="Customized Prompt" />}
                    </button>
                  );
                })}
              </div>

              {/* Prompt Preview Card OR Simple Parcel & CWILL Setup */}
              {templates[activeTab] && templates[activeTab].id === "parcel-cwill" ? (
                <div className="bg-white border border-slate-200 rounded-[4px] p-5 shadow-sm space-y-5">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Parcel Panel & CWILL Setup</h3>
                      <p className="text-xs text-slate-500">Copy status texts & filter keys for {active.name}</p>
                    </div>
                    <a
                      href="https://docs.google.com/spreadsheets/d/1KDjoXEFPyezZoG9Cxvgn1LTNBrRrKmKoLjQd963BVSs/edit?gid=2016016033#gid=2016016033"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                    >
                      <span>Master Sheet</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  </div>

                  {/* 1. Custom Shipment Statuses Table */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                      1. Custom Shipment Statuses (Add in Parcel Panel)
                    </span>
                    <div className="overflow-x-auto border border-slate-200 rounded-[4px]">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                            <th className="py-2.5 px-3 whitespace-nowrap">Timeline</th>
                            <th className="py-2.5 px-3">Status Title</th>
                            <th className="py-2.5 px-3">Customer Notification Message</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {[
                            {
                              day: "Day 3",
                              title: "Warehouse Processing",
                              titleKey: "title_d3",
                              message: "Your order is currently being processed in our warehouse.",
                              msgKey: "msg_d3",
                            },
                            {
                              day: "Day 6",
                              title: "Order Queued for Dispatch",
                              titleKey: "title_d6",
                              message: "Due to high demand, your order is scheduled for dispatch.",
                              msgKey: "msg_d6",
                            },
                            {
                              day: "Day 9",
                              title: "Preparing Shipment",
                              titleKey: "title_d9",
                              message: "Your order is being prepared for handover to the carrier.",
                              msgKey: "msg_d9",
                            },
                          ].map((row) => (
                            <tr key={row.day} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap align-middle">
                                {row.day}
                              </td>
                              <td className="py-2.5 px-3 align-middle">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-slate-900 whitespace-nowrap">{row.title}</span>
                                  <button
                                    type="button"
                                    onClick={() => copyCustomText(row.title, row.titleKey)}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-600 cursor-pointer shadow-2xs transition-colors shrink-0"
                                    title="Copy Status Title"
                                  >
                                    {copiedCustom === row.titleKey ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                                    <span>{copiedCustom === row.titleKey ? "Copied" : "Copy Title"}</span>
                                  </button>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 align-middle">
                                <div className="flex items-center justify-between gap-3">
                                  <span className="font-mono text-xs text-slate-700">"{row.message}"</span>
                                  <button
                                    type="button"
                                    onClick={() => copyCustomText(row.message, row.msgKey)}
                                    className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-800 cursor-pointer shadow-2xs transition-colors"
                                    title="Copy Notification Message"
                                  >
                                    {copiedCustom === row.msgKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                                    <span>{copiedCustom === row.msgKey ? "Copied" : "Copy Message"}</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 2. Filter Keywords */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        2. Filter Keywords (Add in Parcel Panel Settings)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const keywords = "China, Made in China, Chinese, China origin, Manufactured in China, Shenzhen, Factory direct, Chinese supplier, AliExpress, AliBaba, Taobao, Global Sources, Dropshipping, Wholesale China, Direct from China, Chinese factory, Chinese goods, China wholesale, JD.com, Tmall, 1688.com, Pinduoduo, Gearbest, DHgate, Banggood";
                          copyCustomText(keywords, "keywords");
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-800 cursor-pointer shadow-2xs transition-colors"
                      >
                        {copiedCustom === "keywords" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                        <span>{copiedCustom === "keywords" ? "Copied All" : "Copy All Keywords"}</span>
                      </button>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 font-mono leading-relaxed select-all">
                      China, Made in China, Chinese, China origin, Manufactured in China, Shenzhen, Factory direct, Chinese supplier, AliExpress, AliBaba, Taobao, Global Sources, Dropshipping, Wholesale China, Direct from China, Chinese factory, Chinese goods, China wholesale, JD.com, Tmall, 1688.com, Pinduoduo, Gearbest, DHgate, Banggood
                    </div>
                  </div>

                  {/* 3. CWILL Branding Removal Message */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                      3. CWILL Support Chat Message (Send via bottom-right widget)
                    </span>
                    <div className="flex items-center justify-between gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded flex-wrap sm:flex-nowrap">
                      <span className="text-xs text-slate-800 font-mono select-all">
                        Hi, please remove the 'Powered by CWILL' branding badge
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          copyCustomText("Hi, please remove the 'Powered by CWILL' branding badge", "cwill");
                        }}
                        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-800 cursor-pointer shadow-2xs transition-colors"
                      >
                        {copiedCustom === "cwill" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                        <span>{copiedCustom === "cwill" ? "Copied" : "Copy Message"}</span>
                      </button>
                    </div>
                  </div>

                  {/* 4. Verification Checklist (Synced with Stage 5) */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                      4. Verification Checklist (Did you complete these?)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer select-none bg-slate-50 p-2.5 rounded-[4px] border border-slate-200 hover:border-slate-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(activeSubTaskMap["sub-parcel-panel-config"])}
                          onChange={() => toggleSubTask("task-tracking-parcel-cwill", "sub-parcel-panel-config")}
                          className="w-4 h-4 accent-slate-900 rounded-[2px] cursor-pointer"
                        />
                        <span className={activeSubTaskMap["sub-parcel-panel-config"] ? "line-through text-slate-400" : "font-medium"}>
                          Parcel Panel configured & live
                        </span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer select-none bg-slate-50 p-2.5 rounded-[4px] border border-slate-200 hover:border-slate-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(activeSubTaskMap["sub-shipment-statuses"])}
                          onChange={() => toggleSubTask("task-tracking-parcel-cwill", "sub-shipment-statuses")}
                          className="w-4 h-4 accent-slate-900 rounded-[2px] cursor-pointer"
                        />
                        <span className={activeSubTaskMap["sub-shipment-statuses"] ? "line-through text-slate-400" : "font-medium"}>
                          Added 3 Custom Statuses (3, 6, 9 days)
                        </span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer select-none bg-slate-50 p-2.5 rounded-[4px] border border-slate-200 hover:border-slate-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(activeSubTaskMap["sub-blacklist-keywords"])}
                          onChange={() => toggleSubTask("task-tracking-parcel-cwill", "sub-blacklist-keywords")}
                          className="w-4 h-4 accent-slate-900 rounded-[2px] cursor-pointer"
                        />
                        <span className={activeSubTaskMap["sub-blacklist-keywords"] ? "line-through text-slate-400" : "font-medium"}>
                          Added Filter Keywords to settings
                        </span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer select-none bg-slate-50 p-2.5 rounded-[4px] border border-slate-200 hover:border-slate-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(activeSubTaskMap["sub-tracking-url-works"])}
                          onChange={() => toggleSubTask("task-tracking-parcel-cwill", "sub-tracking-url-works")}
                          className="w-4 h-4 accent-slate-900 rounded-[2px] cursor-pointer"
                        />
                        <span className={activeSubTaskMap["sub-tracking-url-works"] ? "line-through text-slate-400" : "font-medium"}>
                          Tested live tracking URL
                        </span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer select-none bg-slate-50 p-2.5 rounded-[4px] border border-slate-200 hover:border-slate-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(activeSubTaskMap["sub-remove-cwill"])}
                          onChange={() => toggleSubTask("task-tracking-parcel-cwill", "sub-remove-cwill")}
                          className="w-4 h-4 accent-slate-900 rounded-[2px] cursor-pointer"
                        />
                        <span className={activeSubTaskMap["sub-remove-cwill"] ? "line-through text-slate-400" : "font-medium"}>
                          Sent CWILL support removal message
                        </span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer select-none bg-slate-50 p-2.5 rounded-[4px] border border-slate-200 hover:border-slate-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(activeSubTaskMap["sub-recheck-cwill"])}
                          onChange={() => toggleSubTask("task-tracking-parcel-cwill", "sub-recheck-cwill")}
                          className="w-4 h-4 accent-slate-900 rounded-[2px] cursor-pointer"
                        />
                        <span className={activeSubTaskMap["sub-recheck-cwill"] ? "line-through text-slate-400" : "font-medium"}>
                          Re-checked storefront (badge removed)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                /* Regular Prompt Preview Card */
                templates[activeTab] && (
                  <div className="bg-white border border-slate-200 rounded-[4px] overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{templates[activeTab].title}</h3>
                        {templates[activeTab].isCustom && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-medium">
                            Custom
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={function() { openEditPromptModal(activeTab); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
                          title="Edit this prompt text"
                        >
                          <Pencil className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={function() { copyPrompt(templates[activeTab].text, activeTab); }}
                          className={"inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[4px] text-xs font-medium border transition-colors shadow-sm " + (copiedIdx === activeTab ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold" : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50")}
                        >
                          {copiedIdx === activeTab ? <><Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} /> Copied</> : <><Copy className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} /> Copy</>}
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <pre className="font-mono text-xs leading-relaxed text-slate-700 bg-slate-50 border border-slate-200 rounded-[4px] p-4 whitespace-pre-wrap overflow-x-auto">
                        {templates[activeTab].text}
                      </pre>
                    </div>
                  </div>
                )
              )}

              {/* Things to Remember Card */}
              {((active.rememberOptions && active.rememberOptions.length > 0) || active.notes) && (
                <div className="bg-amber-50 border border-amber-200 rounded-[4px] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" strokeWidth={2} />
                    <span className="text-sm font-bold text-amber-800">Things to Remember</span>
                  </div>
                  
                  {active.rememberOptions && active.rememberOptions.length > 0 && (
                    <ul className="text-xs text-amber-800 space-y-1 ml-6 mb-2 list-disc">
                      {active.rememberOptions.map(function(opt, idx) {
                        return <li key={idx}>{opt}</li>;
                      })}
                    </ul>
                  )}

                  {active.notes && (
                    <div className="text-xs text-amber-700 leading-relaxed whitespace-pre-wrap ml-6">
                      {active.notes}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Task Checklist & Progress Bar (col-span-12 lg:col-span-5 xl:col-span-4) */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-white border border-slate-200 rounded-[4px] p-4 shadow-sm sticky top-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <ListTodo className="w-4 h-4 text-slate-900" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">Production Checklist</h3>
                      <p className="text-[10px] text-slate-400">Did you complete these?</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 border border-slate-200">
                    {progress.completed} of {progress.total} ({progress.percent}%)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-3.5">
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full bg-slate-900 transition-all duration-300"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                </div>

                {/* Creative Stage-by-Stage Task List */}
                <div className="space-y-2 max-h-[58vh] overflow-y-auto pr-1">
                  {currentTasks.map((task, idx) => {
                    const totalSubs = task.children ? task.children.length : 1;
                    const completedSubs = task.children
                      ? task.children.filter((c) => c.completed).length
                      : task.completed
                      ? 1
                      : 0;
                    const isStageComplete = task.completed || (task.children && task.children.length > 0 && completedSubs === totalSubs);
                    const isCollapsed = collapsedTasks[task.id];

                    return (
                      <div
                        key={task.id}
                        className={`border rounded-[4px] transition-all overflow-hidden ${
                          isStageComplete
                            ? "bg-slate-50/80 border-slate-200"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {/* Stage Header Row */}
                        <div className="p-2.5 flex items-center justify-between gap-2 cursor-pointer select-none">
                          <div
                            onClick={() => toggleTask(task.id)}
                            className="flex items-center gap-2.5 flex-1 min-w-0"
                          >
                            {/* Circular Milestone Number / Checkmark */}
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                                isStageComplete
                                  ? "bg-slate-900 text-white"
                                  : "bg-slate-100 text-slate-600 border border-slate-300"
                              }`}
                            >
                              {isStageComplete ? <Check className="w-3 h-3" strokeWidth={3} /> : idx + 1}
                            </div>

                            <span
                              className={`text-xs font-semibold truncate flex items-center gap-1.5 ${
                                isStageComplete ? "line-through text-slate-400" : "text-slate-800"
                              }`}
                            >
                              <span>{task.title}</span>
                              {task.isCritical && (
                                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide shrink-0">
                                  Priority
                                </span>
                              )}
                            </span>
                          </div>

                          {/* Subtask Counter & Collapse Arrow */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {task.children && task.children.length > 0 && (
                              <span
                                className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-[3px] ${
                                  isStageComplete
                                    ? "bg-slate-200 text-slate-800"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {completedSubs}/{totalSubs}
                              </span>
                            )}

                            {task.children && task.children.length > 0 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCollapseTask(task.id);
                                }}
                                className="text-slate-400 hover:text-slate-700 p-0.5 transition-colors"
                              >
                                {isCollapsed ? (
                                  <ChevronRight className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Subtasks Accordion Content */}
                        {task.children && task.children.length > 0 && !isCollapsed && (
                          <div className="px-3 pb-2.5 pt-1 space-y-1.5 border-t border-slate-100 bg-slate-50/40">
                            {task.children.map((sub) => (
                              <label
                                key={sub.id}
                                className="flex items-center gap-2 cursor-pointer select-none group"
                              >
                                <input
                                  type="checkbox"
                                  checked={sub.completed}
                                  onChange={() => toggleSubTask(task.id, sub.id)}
                                  className="w-3.5 h-3.5 accent-slate-900 rounded-[2px] cursor-pointer shrink-0"
                                />
                                <span
                                  className={`text-[11px] leading-tight transition-colors ${
                                    sub.completed
                                      ? "line-through text-slate-400"
                                      : "text-slate-600 group-hover:text-slate-900"
                                  }`}
                                >
                                  {sub.title}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add Custom Task Input */}
                <div className="mt-3.5 pt-3 border-t border-slate-100">
                  <form onSubmit={handleAddCustomTask} className="flex gap-1.5 mb-1.5">
                    <input
                      type="text"
                      placeholder="+ Add personal task..."
                      value={newTaskInput}
                      onChange={(e) => setNewTaskInput(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 text-xs rounded-[4px] border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                    <Button type="submit" variant="outline" size="sm" className="h-auto py-1 px-2.5 text-xs">
                      Add
                    </Button>
                  </form>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={resetStoreTasks}
                      className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset Checklist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {editingPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-[4px] p-5 max-w-xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">
                Edit Prompt: {editingPrompt.title}
              </h3>
              <button
                onClick={() => setEditingPrompt(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Textarea */}
            <textarea
              id="promptTextarea"
              rows={12}
              value={editingPrompt.rawText}
              onChange={(e) => setEditingPrompt({ ...editingPrompt, rawText: e.target.value })}
              className="w-full px-3 py-2 rounded-[4px] border border-slate-300 text-xs font-mono leading-relaxed text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/50"
            />

            {/* Simple Inline Variable Tags */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
              <span className="text-[10px] font-medium text-slate-400">Insert tag:</span>
              {DYNAMIC_TAGS.map((d) => (
                <button
                  key={d.tag}
                  type="button"
                  onClick={() => handleInsertTag(d.tag)}
                  title={`Insert ${d.label}`}
                  className="px-1.5 py-0.5 rounded-[3px] bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 font-mono text-[10px] transition-colors cursor-pointer border border-slate-200"
                >
                  {d.tag}
                </button>
              ))}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetCustomPrompt}
                className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                Reset Default
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingPrompt(null)}>
                  Cancel
                </Button>
                <Button variant="default" size="sm" onClick={handleSaveCustomPrompt}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUserModal && (!currentUser || !currentUser.email) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-[4px] p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <Store className="w-5 h-5 text-slate-900" strokeWidth={2} />
              <h3 className="text-base font-bold text-slate-900">Welcome to Empire Production Hub</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Enter your Name & Email once. Your stores and history will automatically stay saved to your profile even if you close the tab.
            </p>
            <form onSubmit={handleSaveUser} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahim"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-[4px] border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-950"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Your Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahim@example.com"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-[4px] border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-950"
                />
              </div>
              <div className="pt-2">
                <Button type="submit" variant="default" size="sm" className="w-full">
                  Get Started
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}