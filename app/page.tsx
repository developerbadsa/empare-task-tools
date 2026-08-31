"use client";
import { useState, useEffect, useRef } from "react";
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
  Sparkles,
  Clock,
  FileText,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { autoFillStore, getSupportedCountries } from "@/lib/autoFill";

interface UserProfile {
  name: string;
  email: string;
}

export interface TaskSubItem {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  isCritical?: boolean;
  completed: boolean;
  children?: TaskSubItem[];
  stageNote?: string;
}

export interface StoreData {
  id: string;
  name: string;
  logoText: string;
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
      { id: "sub-logo-name", title: "Logo + Store Name updated", completed: false },
      { id: "sub-favicon", title: "Favicon uploaded & verified", completed: false },
      { id: "sub-brand-colors", title: "Brand Colors set", completed: false },
      { id: "sub-logo-reference", title: "Logo as per reference", completed: false },
    ],
  },
  {
    id: "task-seo",
    title: "2. SEO",
    completed: false,
    children: [
      { id: "sub-seo-meta-title", title: "Meta Title set", completed: false },
      { id: "sub-seo-meta-desc", title: "Meta Description set", completed: false },
      { id: "sub-seo-social-image", title: "SEO / Social Sharing Image uploaded", completed: false },
    ],
  },
  {
    id: "task-checkout",
    title: "3. Checkout",
    completed: false,
    children: [
      { id: "sub-checkout-logo", title: "Checkout Logo placed", completed: false },
      { id: "sub-checkout-color", title: "Checkout Brand Color matched", completed: false },
      { id: "sub-checkout-title", title: "Checkout Title & Branding verified", completed: false },
    ],
  },
  {
    id: "task-pages",
    title: "4. Pages",
    completed: false,
    children: [
      { id: "sub-pages-translation", title: "Natural local-language translation", completed: false },
      { id: "sub-pages-credentials", title: "Correct Company / Contact / Address aligned", completed: false },
      { id: "sub-pages-contact-all", title: "All pages have Contact Information", completed: false },
      { id: "sub-pages-business-info", title: "Our Business Information is correct", completed: false },
      { id: "sub-pages-no-insta", title: "No unnecessary Instagram repetition", completed: false },
    ],
  },
  {
    id: "task-collections",
    title: "5. Collections",
    completed: false,
    children: [
      { id: "sub-collections-only-main", title: "Only Main Collections present", completed: false },
      { id: "sub-collections-tags", title: "Tags / conditions added for Collections", completed: false },
      { id: "sub-collections-no-subcat", title: "No sub-category / sub-menu added", completed: false },
      { id: "sub-collections-no-footer-extra", title: "No extra collection in footer", completed: false },
    ],
  },
  {
    id: "task-discounts",
    title: "6. Discounts",
    completed: false,
    children: [
      { id: "sub-discount-10", title: "10% Discount created", completed: false },
      { id: "sub-discount-15", title: "15% Discount created", completed: false },
      { id: "sub-discount-20", title: "20% Discount created", completed: false },
    ],
  },
  {
    id: "task-product-page",
    title: "7. Product Page",
    completed: false,
    children: [
      { id: "sub-product-swatch", title: "Image Swatch below color", completed: false },
      { id: "sub-product-swatch-king", title: "Swatch King app installed & configured", completed: false },
      { id: "sub-product-payment-logos", title: "Payment logos in one line", completed: false },
      { id: "sub-product-cart-blocks", title: "Cart button blocks match reference", completed: false },
      { id: "sub-product-no-remove", title: "Nothing removed without instruction", completed: false },
    ],
  },
  {
    id: "task-cart-drawer",
    title: "8. Cart Drawer",
    completed: false,
    children: [
      { id: "sub-cart-drawer-ref", title: "Cart Drawer same as reference", completed: false },
    ],
  },
  {
    id: "task-shipping",
    title: "9. Shipping",
    completed: false,
    children: [
      { id: "sub-shipping-free", title: "Free Express Shipping in local language", completed: false },
      { id: "sub-shipping-consistent", title: "Store-wide consistency verified", completed: false },
    ],
  },
  {
    id: "task-tracking-parcel-panel",
    title: "10. Tracking / Parcel Panel",
    isCritical: true,
    completed: false,
    children: [
      { id: "sub-parcel-panel-config", title: "Parcel Panel configured", completed: false },
      { id: "sub-tracking-page-config", title: "Tracking Page configured", completed: false },
      { id: "sub-tracking-exact-docs", title: "100% exact as per docs", completed: false },
      { id: "sub-shipment-statuses", title: "Custom Shipment Statuses set", completed: false },
      { id: "sub-tracking-url-works", title: "Tracking URL works", completed: false },
      { id: "sub-tracking-manual-test", title: "Manually test tracking", completed: false },
    ],
  },
  {
    id: "task-cwill",
    title: "11. CWILL",
    isCritical: true,
    completed: false,
    children: [
      { id: "sub-remove-cwill", title: "Remove 'Powered by CWILL'", completed: false },
      { id: "sub-cwill-confirm-store", title: "Correct store confirmed", completed: false },
      { id: "sub-cwill-recheck", title: "Re-check after removal", completed: false },
    ],
  },
  {
    id: "task-cookie-banner",
    title: "12. Cookie",
    completed: false,
    children: [
      { id: "sub-cookie-remove", title: "Cookie Banner removed", completed: false },
      { id: "sub-test-storefront", title: "Test storefront clean view", completed: false },
    ],
  },
  {
    id: "task-final-qa",
    title: "13. Final QA & Review",
    isCritical: true,
    completed: false,
    children: [
      { id: "sub-qa-theme", title: "Theme", completed: false },
      { id: "sub-qa-seo", title: "SEO", completed: false },
      { id: "sub-qa-checkout", title: "Checkout", completed: false },
      { id: "sub-qa-pages", title: "Pages", completed: false },
      { id: "sub-qa-collections", title: "Collections", completed: false },
      { id: "sub-qa-discounts", title: "Discounts", completed: false },
      { id: "sub-qa-shipping", title: "Shipping", completed: false },
      { id: "sub-qa-product-page", title: "Product Page", completed: false },
      { id: "sub-qa-payment-logos", title: "Payment Logos", completed: false },
      { id: "sub-qa-cart-drawer", title: "Cart Drawer", completed: false },
      { id: "sub-qa-parcel-panel", title: "Parcel Panel", completed: false },
      { id: "sub-qa-tracking", title: "Tracking", completed: false },
      { id: "sub-qa-cwill", title: "CWILL", completed: false },
      { id: "sub-qa-cookie", title: "Cookie", completed: false },
      { id: "sub-qa-contact-info", title: "Contact Info", completed: false },
      { id: "sub-final-test-order", title: "Final Live Test / Checkout Order", completed: false },
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
  logoText: "",
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
    logoText: "Luminari",
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
    logoText: "Luminari",
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
  { tag: "{LOGO_TEXT}", label: "Logo Text", desc: "e.g. Luminari" },
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
      "Act as an expert e-commerce visual director. Your objective is to transform the attached reference image into a new photorealistic, high-end commercial photo for **{STORE_NAME}** ({COUNTRY}).\n\n" +
      "MANDATORY STRICT RULES:\n\n" +
      "COMPLETE BRAND REMOVAL: Detect and 100% remove all reference logos, brand names, watermarks, tags, Asian/Chinese text, and promotional labels. Replace with clean unbranded surfaces or {STORE_NAME} styling where necessary.\n\n" +
      "MODEL PRESENCE & DEMOGRAPHIC (STRONG CONDITIONAL RULE): First, analyze the original reference image to see if any people (models or characters) are present.\n\n" +
      "IF PEOPLE ARE PRESENT: You must completely replace them with new, natural-looking models native to **{COUNTRY}** (matching realistic European/Scandinavian facial features, natural skin tone, hair styling, eye color, and cultural fashion).\n\n" +
      "IF NO PEOPLE ARE PRESENT: You absolutely must not add any new models or characters to the scene. The scene should remain unpopulated.\n\n" +
      "AUTHENTIC ENVIRONMENT: Replace the background with an authentic, modern setting matching **{COUNTRY}** (e.g., a clean minimalist Scandinavian-influenced interior or exterior, warm natural lighting, with a summer ambiance if applicable).\n\n" +
      "PRODUCT & FIDELITY: Keep the exact product shape, composition, camera angle, pose (of objects or products), framing, and true-to-life texture of all core products and foreground elements unchanged.\n\n" +
      "ZERO UNWANTED TEXT / NO CGI: Do NOT invent or add any random floating text, badges, or CGI artifacts. Keep output 100% photorealistic, crisp, and studio-grade.",
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
      "2. NO INVENTING DATA: If any data is not present in the reference text, SKIP it cleanly. Never hallucinate or invent fake phone numbers, addresses, payment methods, shipping details, or other business information.\n" +
      "3. NATIVE LOCALIZATION: Write in natural, idiomatic local **{LANGUAGE}** as spoken by real native speakers in **{COUNTRY}** (strictly no robotic word-for-word translation).\n" +
      "4. STANDARD HIERARCHY: Format headings with **26px** and body paragraphs with **14px**.\n" +
      "5. COUNTRY VERIFICATION: Verify all payment methods, shipping options, currencies, taxes, and other country-specific information belong strictly to **{COUNTRY}**. Automatically remove options from other countries.\n" +
      "6. BUSINESS INFORMATION FORMAT: Whenever the reference page contains a business/company information section, ALWAYS present it using this exact heading and exact numbered structure. Do not change the order, numbering, or labels:\n\n" +
      "**Our Business Information**\n\n" +
      "1. Store Name:\n" +
      "2. Company Name:\n" +
      "3. E-mail:\n" +
      "4. Address:\n" +
      "5. Service Hours:\n\n" +
      "7. BUSINESS INFORMATION VALUES: Fill the above fields only with the official store credentials provided in this prompt. Never add extra business information, fields, phone numbers, social links, registration numbers, or other details unless they are explicitly provided in the official store credentials.\n" +
      "8. BUSINESS INFORMATION LANGUAGE: Keep the heading and field labels exactly as written above unless I specifically ask you to translate them. The values should use the official store data exactly as provided.",
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
    .replace(/\{LOGO_TEXT\}/g, st.logoText || st.name || "")
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Custom prompt overrides per template ID (e.g. { "image-transform": "..." })
  const [customPrompts, setCustomPrompts] = useState<Record<string, string>>({});
  const [editingPrompt, setEditingPrompt] = useState<{ id: string; title: string; rawText: string } | null>(null);

  // Store Workflow Tasks per Store ID
  const [storeTasks, setStoreTasks] = useState<Record<string, TaskItem[]>>({});
  const [collapsedTasks, setCollapsedTasks] = useState<Record<string, boolean>>({});
  const [newTaskInput, setNewTaskInput] = useState("");

  // Auto-Fill Engine State
  const [autoFillSources, setAutoFillSources] = useState<string[]>([]);
  const [autoFillMsg, setAutoFillMsg] = useState("");
  const autoFillTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Export State
  const [exportMsg, setExportMsg] = useState("");

  // Country Quick Panel
  const [showCountryPanel, setShowCountryPanel] = useState(false);

  // Stage Notes
  const [editingNoteTaskId, setEditingNoteTaskId] = useState<string | null>(null);

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

  // In-app non-blocking confirmation modal
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    confirmText?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  } | null>(null);

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

    try {
      const res = await fetch("/api/stores?email=" + encodeURIComponent(cleanEmail));
      const data = await res.json();
      if (data.success) {
        if (data.userData) {
          const serverStores = Array.isArray(data.userData.stores)
            ? data.userData.stores.map((s: StoreData) => ({
                ...s,
                rememberOptions: s.rememberOptions || [...getDefaultChecked(rememberPresets)],
              }))
            : [];
          const nextActiveId = data.userData.activeId || (serverStores[0] ? serverStores[0].id : "");

          setStores(serverStores);
          setActiveId(nextActiveId);
          localStorage.setItem(storageKey, JSON.stringify({ stores: serverStores, activeId: nextActiveId }));

          if (data.userData.customPrompts) {
            setCustomPrompts(data.userData.customPrompts);
            localStorage.setItem(promptsKey, JSON.stringify(data.userData.customPrompts));
          } else {
            setCustomPrompts({});
          }

          if (data.userData.tasks) {
            const rawMap = data.userData.tasks;
            const migratedMap: Record<string, TaskItem[]> = {};
            Object.keys(rawMap).forEach((k) => {
              migratedMap[k] = migrateTasks(rawMap[k]);
            });
            setStoreTasks(migratedMap);
            localStorage.setItem(tasksKey, JSON.stringify(migratedMap));
          } else {
            setStoreTasks({});
          }
        } else {
          // Clean fresh start - Clear all dirty caches
          setStores([]);
          setActiveId("");
          setCustomPrompts({});
          setStoreTasks({});
          try {
            localStorage.removeItem(storageKey);
            localStorage.removeItem(promptsKey);
            localStorage.removeItem(tasksKey);
          } catch (e) {}
        }
        setIsInitialized(true);
        return;
      }
    } catch (e) {}

    // Offline / Error fallback: Start fresh and clean
    setStores([]);
    setActiveId("");
    setIsInitialized(true);
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

    // Strict sanitation: never send orphan tasks of deleted stores
    const validStoreIds = new Set((currentStores || []).map((s) => s.id));
    const tasksRaw = currentTasks !== undefined ? currentTasks : storeTasks;
    const sanitizedTasks: Record<string, TaskItem[]> = {};
    if (tasksRaw && typeof tasksRaw === "object") {
      Object.keys(tasksRaw).forEach((k) => {
        if (validStoreIds.has(k)) {
          sanitizedTasks[k] = tasksRaw[k];
        }
      });
    }

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
          tasks: sanitizedTasks,
        }),
      }).catch(() => {});
    } catch (e) {}
  }


  const isInitialLoad = useRef(true);


  // 2. Persist store data ONLY on user edits, preventing unnecessary initial POST on page load
  useEffect(() => {
    if (!isInitialized || !currentUser) return;
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    try {
      const storageKey = "store_toolkit_data_" + currentUser.email.trim().toLowerCase();
      localStorage.setItem(storageKey, JSON.stringify({ stores, activeId }));
      syncToServer(currentUser.name, currentUser.email, stores, activeId, customPrompts, storeTasks);
    } catch (e) {}
  }, [stores, activeId, customPrompts, storeTasks, currentUser, isInitialized]);



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
    setConfirmAction({
      title: "Delete Preset",
      message: "Are you sure you want to delete this preset?",
      confirmText: "Delete",
      isDestructive: true,
      onConfirm: () => {
        setRememberPresets((prev) => prev.filter((p) => p.id !== id));
        setConfirmAction(null);
      },
    });
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
    setConfirmAction({
      title: "Reset Presets",
      message: "Reset all presets back to system defaults?",
      confirmText: "Reset Defaults",
      isDestructive: false,
      onConfirm: () => {
        setRememberPresets(DEFAULT_REMEMBER_PRESETS);
        setConfirmAction(null);
      },
    });
  }

  function addStore() {
    var id = Date.now().toString();
    const newStore = { ...form, id: id };
    const next = stores.concat([newStore]);
    setStores(next);
    setActiveId(id);
    setForm({ ...emptyStore, rememberOptions: [...getDefaultChecked(rememberPresets)] });
    setShowForm(false);

    if (currentUser) {
      const cleanEmail = currentUser.email.trim().toLowerCase();
      const storageKey = "store_toolkit_data_" + cleanEmail;
      localStorage.setItem(storageKey, JSON.stringify({ stores: next, activeId: id }));
      syncToServer(currentUser.name, cleanEmail, next, id, customPrompts, storeTasks);
    }
  }

  function updateStore() {
    const next = stores.map((s) => (s.id === form.id ? form : s));
    setStores(next);
    setForm({ ...emptyStore, rememberOptions: [...getDefaultChecked(rememberPresets)] });
    setShowForm(false);

    if (currentUser) {
      const cleanEmail = currentUser.email.trim().toLowerCase();
      const storageKey = "store_toolkit_data_" + cleanEmail;
      localStorage.setItem(storageKey, JSON.stringify({ stores: next, activeId: activeId }));
      syncToServer(currentUser.name, cleanEmail, next, activeId, customPrompts, storeTasks);
    }
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
    setIsInitialized(false);
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

  function migrateTasks(tasks: TaskItem[]): TaskItem[] {
    if (!Array.isArray(tasks)) return DEFAULT_STORE_TASKS;

    // Detect old v1 structure (separate tracking + cwill)
    const hasV1 = tasks.some((t) => t.id === "task-tracking-parcel" || t.id === "task-cwill-removal");
    // Detect old v2 structure (combined tracking-parcel-cwill)
    const hasV2 = tasks.some((t) => t.id === "task-tracking-parcel-cwill");

    if (!hasV1 && !hasV2) return tasks;

    // Build sub-task completion map from old structure
    const subMap: Record<string, boolean> = {};
    for (const t of tasks) {
      if (t.id === "task-tracking-parcel" || t.id === "task-cwill-removal" || t.id === "task-tracking-parcel-cwill") {
        if (t.children) {
          t.children.forEach((c) => { subMap[c.id] = c.completed; });
        }
      }
      // Also migrate subtask completion from any matching category
      if (t.children) {
        t.children.forEach((c) => { subMap[c.id] = c.completed; });
      }
    }

    return DEFAULT_STORE_TASKS.map((defTask) => {
      const existing = tasks.find((t) => t.id === defTask.id);

      // Migrate old combined tracking+cwill into new split tasks
      if (defTask.id === "task-tracking-parcel-panel" || defTask.id === "task-cwill") {
        const mergedChildren = defTask.children?.map((c) => ({
          ...c,
          completed: Boolean(subMap[c.id]),
        }));
        const allDone = mergedChildren ? mergedChildren.every((c) => c.completed) : false;
        return {
          ...defTask,
          completed: allDone,
          children: mergedChildren,
        };
      }

      if (existing) {
        // Merge existing subtask completions into new default children
        if (existing.children && defTask.children) {
          const existingSubMap: Record<string, boolean> = {};
          existing.children.forEach((c) => { existingSubMap[c.id] = c.completed; });
          const mergedChildren = defTask.children.map((c) => ({
            ...c,
            completed: existingSubMap[c.id] !== undefined ? existingSubMap[c.id] : Boolean(subMap[c.id]),
          }));
          const allDone = mergedChildren.every((c) => c.completed);
          return { ...defTask, completed: allDone, children: mergedChildren };
        }
        return existing;
      }

      // New category not present in old data — use fresh default
      return defTask;
    });
  }

  // Task Checklist Helpers
  function getActiveTasks(): TaskItem[] {
    if (!activeId) return DEFAULT_STORE_TASKS;
    const raw = storeTasks[activeId] || DEFAULT_STORE_TASKS;
    return migrateTasks(raw);
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
        const nextChildren = t.children.map((c) => {
          if (c.id === subId) {
            const newCompleted = !c.completed;
            return { ...c, completed: newCompleted, completedAt: newCompleted ? new Date().toISOString() : undefined };
          }
          return c;
        });
        const allCompleted = nextChildren.every((c) => c.completed);
        return { ...t, completed: allCompleted, children: nextChildren };
      }
      return t;
    });
    saveActiveTasks(updated);
  }

  // Mark all subtasks in a category as done/undone
  function toggleMarkAllDone(taskId: string) {
    const current = getActiveTasks();
    const task = current.find((t) => t.id === taskId);
    if (!task || !task.children) return;
    const allDone = task.children.every((c) => c.completed);
    const now = new Date().toISOString();
    const updated = current.map((t) => {
      if (t.id === taskId && t.children) {
        const nextChildren = t.children.map((c) => ({
          ...c,
          completed: !allDone,
          completedAt: !allDone ? now : undefined,
        }));
        return { ...t, completed: !allDone, children: nextChildren };
      }
      return t;
    });
    saveActiveTasks(updated);
  }

  // Save a note for a stage
  function saveStageNote(taskId: string, note: string) {
    const current = getActiveTasks();
    const updated = current.map((t) => (t.id === taskId ? { ...t, stageNote: note } : t));
    saveActiveTasks(updated);
  }

  // Export checklist as formatted report
  function exportChecklistReport() {
    if (!active) return;
    const tasks = getActiveTasks();
    const prog = calculateProgress(tasks);
    const now = new Date().toLocaleString();
    let report = ``;
    report += `\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n`;
    report += `\u2500 STORE CHECKLIST REPORT \u2500\n`;
    report += `\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n`;
    report += `Store: ${active.name} (${active.country})\n`;
    report += `Domain: ${active.domain}\n`;
    report += `Company: ${active.company}\n`;
    report += `Generated: ${now}\n`;
    report += `Progress: ${prog.completed}/${prog.total} (${prog.percent}%)\n`;
    report += `\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n`;
    tasks.forEach((t, i) => {
      const totalSubs = t.children ? t.children.length : 1;
      const doneSubs = t.children ? t.children.filter((c) => c.completed).length : t.completed ? 1 : 0;
      const icon = doneSubs === totalSubs ? '\u2705' : doneSubs > 0 ? '\u23F3' : '\u2B1C';
      report += `${icon} ${t.title} [${doneSubs}/${totalSubs}]${t.isCritical ? ' \u{1F534}' : ''}\n`;
      if (t.children) {
        t.children.forEach((c) => {
          report += `   ${c.completed ? '\u2705' : '\u2B1C'} ${c.title}`;
          if (c.completedAt) report += ` (${new Date(c.completedAt).toLocaleDateString()})`;
          report += `\n`;
        });
      }
      if (t.stageNote) report += `   \u{1F4DD} Note: ${t.stageNote}\n`;
      report += `\n`;
    });
    report += `\u2500\u2500\u2500\u2500 END REPORT \u2500\u2500\u2500\u2500\n`;
    navigator.clipboard.writeText(report);
    setExportMsg('Report copied! Paste in PM chat.');
    setTimeout(() => setExportMsg(''), 3000);
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

  // ─── Auto-Fill Engine ────────────────────────────────────────────
  function runAutoDetect(currentForm: StoreData) {
    const result = autoFillStore({
      name: currentForm.name,
      logoText: currentForm.logoText,
      company: currentForm.company,
      address: currentForm.address,
      email: currentForm.email,
      domain: currentForm.domain,
      country: currentForm.country,
      language: currentForm.language,
      currency: currentForm.currency,
    });

    if (result.sources.length === 0) return;

    // Merge filled + suggestions into form
    const updates: Partial<StoreData> = {};
    if (result.filled.country && !currentForm.country) updates.country = result.filled.country;
    if (result.filled.language && !currentForm.language) updates.language = result.filled.language;
    if (result.filled.currency && !currentForm.currency) updates.currency = result.filled.currency;
    if (result.filled.hours && currentForm.hours === emptyStore.hours) updates.hours = result.filled.hours;
    if (result.suggestions.company && !currentForm.company) updates.company = result.suggestions.company;

    if (Object.keys(updates).length > 0) {
      setForm((prev) => ({ ...prev, ...updates }));
      setAutoFillSources(result.sources);
      setAutoFillMsg(`Auto-detected from: ${result.sources.join(', ')}`);
      setTimeout(() => setAutoFillMsg(''), 5000);
    }
  }

  // Debounced auto-fill trigger on form change
  function handleFormChange(key: string, value: string) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Debounce auto-detect by 600ms
      if (autoFillTimerRef.current) clearTimeout(autoFillTimerRef.current);
      autoFillTimerRef.current = setTimeout(() => runAutoDetect(next), 600);
      return next;
    });
  }

  function handleManualAutoFill() {
    runAutoDetect(form);
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
    setConfirmAction({
      title: "Reset Store Checklist",
      message: "Reset the checklist for this store back to default tasks?",
      confirmText: "Reset Checklist",
      isDestructive: false,
      onConfirm: () => {
        saveActiveTasks(DEFAULT_STORE_TASKS);
        setConfirmAction(null);
      },
    });
  }


  function deleteStore(id: string) {
    setConfirmAction({
      title: "Delete Store",
      message: "Are you sure you want to remove this store?",
      confirmText: "Delete Store",
      isDestructive: true,
      onConfirm: () => {
        const next = stores.filter(function(s) { return s.id !== id; });
        const nextActiveId = activeId === id ? (next[0] ? next[0].id : "") : activeId;
        const nextTasks = { ...storeTasks };
        delete nextTasks[id];

        setStores(next);
        setActiveId(nextActiveId);
        setStoreTasks(nextTasks);

        if (currentUser) {
          const cleanEmail = currentUser.email.trim().toLowerCase();
          const storageKey = "store_toolkit_data_" + cleanEmail;
          const tasksKey = "store_toolkit_tasks_" + cleanEmail;
          localStorage.setItem(storageKey, JSON.stringify({ stores: next, activeId: nextActiveId }));
          localStorage.setItem(tasksKey, JSON.stringify(nextTasks));
          syncToServer(currentUser.name, cleanEmail, next, nextActiveId, customPrompts, nextTasks);
        }
        setConfirmAction(null);
      },
    });
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
    { key: "logoText", label: "Logo Text", r: true, placeholder: "e.g. Luminari (appears on logo & branding)" },
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
              {active.logoText && <span className="px-2 py-0.5 rounded-[4px] bg-sky-50 text-sky-700 text-xs font-medium border border-sky-200">Logo: {active.logoText}</span>}
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

        {/* Store Form (Add / Edit Store) */}
        {showForm && (
          <div className="bg-white border border-slate-200 rounded-[4px] p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="text-base font-bold text-slate-900">{form.id ? "Edit Store" : "Add New Store"}</h3>
              <div className="flex items-center gap-2">
                {autoFillMsg && (
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-[4px] flex items-center gap-1 animate-pulse">
                    <Sparkles className="w-3 h-3" /> {autoFillMsg}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleManualAutoFill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-[4px] transition-colors cursor-pointer"
                  title="Auto-detect fields from what you've typed"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Auto-Detect
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(function(f) {
                const isAutoFilled = autoFillSources.length > 0 && (
                  (f.key === 'country' && form.country && !form.id) ||
                  (f.key === 'language' && form.language && !form.id) ||
                  (f.key === 'currency' && form.currency && !form.id)
                );
                return (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      {f.label} {f.r && <span className="text-rose-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={(form as any)[f.key] || ""}
                      onChange={function(e) { handleFormChange(f.key, e.target.value); }}
                      placeholder={f.placeholder}
                      className={`w-full px-3 py-2 rounded-[4px] border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-950 ${isAutoFilled ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-300'}`}
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

        {!active && stores.length === 0 && !showForm && (
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

                  {/* 4. Verification Checklist (Synced with Tasks 10 & 11) */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                      4. Verification Checklist (Did you complete these?)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer select-none bg-slate-50 p-2.5 rounded-[4px] border border-slate-200 hover:border-slate-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(activeSubTaskMap["sub-parcel-panel-config"])}
                          onChange={() => toggleSubTask("task-tracking-parcel-panel", "sub-parcel-panel-config")}
                          className="w-4 h-4 accent-slate-900 rounded-[2px] cursor-pointer"
                        />
                        <span className={activeSubTaskMap["sub-parcel-panel-config"] ? "line-through text-slate-400" : "font-medium"}>
                          Parcel Panel configured
                        </span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer select-none bg-slate-50 p-2.5 rounded-[4px] border border-slate-200 hover:border-slate-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(activeSubTaskMap["sub-tracking-page-config"])}
                          onChange={() => toggleSubTask("task-tracking-parcel-panel", "sub-tracking-page-config")}
                          className="w-4 h-4 accent-slate-900 rounded-[2px] cursor-pointer"
                        />
                        <span className={activeSubTaskMap["sub-tracking-page-config"] ? "line-through text-slate-400" : "font-medium"}>
                          Tracking Page configured
                        </span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer select-none bg-slate-50 p-2.5 rounded-[4px] border border-slate-200 hover:border-slate-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(activeSubTaskMap["sub-shipment-statuses"])}
                          onChange={() => toggleSubTask("task-tracking-parcel-panel", "sub-shipment-statuses")}
                          className="w-4 h-4 accent-slate-900 rounded-[2px] cursor-pointer"
                        />
                        <span className={activeSubTaskMap["sub-shipment-statuses"] ? "line-through text-slate-400" : "font-medium"}>
                          Custom Shipment Statuses set
                        </span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer select-none bg-slate-50 p-2.5 rounded-[4px] border border-slate-200 hover:border-slate-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(activeSubTaskMap["sub-tracking-url-works"])}
                          onChange={() => toggleSubTask("task-tracking-parcel-panel", "sub-tracking-url-works")}
                          className="w-4 h-4 accent-slate-900 rounded-[2px] cursor-pointer"
                        />
                        <span className={activeSubTaskMap["sub-tracking-url-works"] ? "line-through text-slate-400" : "font-medium"}>
                          Tracking URL tested & working
                        </span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer select-none bg-slate-50 p-2.5 rounded-[4px] border border-slate-200 hover:border-slate-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(activeSubTaskMap["sub-tracking-manual-test"])}
                          onChange={() => toggleSubTask("task-tracking-parcel-panel", "sub-tracking-manual-test")}
                          className="w-4 h-4 accent-slate-900 rounded-[2px] cursor-pointer"
                        />
                        <span className={activeSubTaskMap["sub-tracking-manual-test"] ? "line-through text-slate-400" : "font-medium"}>
                          Manually test tracking
                        </span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer select-none bg-slate-50 p-2.5 rounded-[4px] border border-slate-200 hover:border-slate-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(activeSubTaskMap["sub-remove-cwill"])}
                          onChange={() => toggleSubTask("task-cwill", "sub-remove-cwill")}
                          className="w-4 h-4 accent-slate-900 rounded-[2px] cursor-pointer"
                        />
                        <span className={activeSubTaskMap["sub-remove-cwill"] ? "line-through text-slate-400" : "font-medium"}>
                          Removed 'Powered by CWILL'
                        </span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer select-none bg-slate-50 p-2.5 rounded-[4px] border border-slate-200 hover:border-slate-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(activeSubTaskMap["sub-cwill-confirm-store"])}
                          onChange={() => toggleSubTask("task-cwill", "sub-cwill-confirm-store")}
                          className="w-4 h-4 accent-slate-900 rounded-[2px] cursor-pointer"
                        />
                        <span className={activeSubTaskMap["sub-cwill-confirm-store"] ? "line-through text-slate-400" : "font-medium"}>
                          Correct store confirmed
                        </span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer select-none bg-slate-50 p-2.5 rounded-[4px] border border-slate-200 hover:border-slate-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(activeSubTaskMap["sub-cwill-recheck"])}
                          onChange={() => toggleSubTask("task-cwill", "sub-cwill-recheck")}
                          className="w-4 h-4 accent-slate-900 rounded-[2px] cursor-pointer"
                        />
                        <span className={activeSubTaskMap["sub-cwill-recheck"] ? "line-through text-slate-400" : "font-medium"}>
                          Re-checked after removal
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

            {/* Right Column: Task Checklist & Progress Bar */}
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
                  <div className="flex items-center gap-1.5">
                    {exportMsg && (
                      <span className="text-[10px] font-semibold text-emerald-600 animate-pulse">{exportMsg}</span>
                    )}
                    <button
                      onClick={exportChecklistReport}
                      className="text-[10px] font-semibold px-2 py-1 rounded-[3px] bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                      title="Export report to clipboard"
                    >
                      <FileText className="w-3 h-3" /> Export
                    </button>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 border border-slate-200">
                      {progress.completed}/{progress.total} ({progress.percent}%)
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3.5">
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        progress.percent === 100
                          ? "bg-emerald-500"
                          : progress.percent >= 60
                          ? "bg-slate-900"
                          : progress.percent >= 30
                          ? "bg-amber-500"
                          : "bg-slate-400"
                      }`}
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                  {/* Stage mini-bar dots */}
                  <div className="flex gap-0.5 mt-1.5">
                    {currentTasks.map((task) => {
                      const totalSubs = task.children ? task.children.length : 1;
                      const doneSubs = task.children ? task.children.filter((c) => c.completed).length : task.completed ? 1 : 0;
                      const pct = totalSubs > 0 ? doneSubs / totalSubs : 0;
                      return (
                        <div
                          key={task.id}
                          className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                            pct === 1 ? "bg-emerald-500" : pct > 0 ? "bg-amber-400" : "bg-slate-200"
                          }`}
                          title={`${task.title}: ${doneSubs}/${totalSubs}`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Country Quick Panel (collapsible) */}
                {active && (
                  <div className="mb-3">
                    <button
                      onClick={() => setShowCountryPanel(!showCountryPanel)}
                      className="w-full text-[10px] font-semibold px-2.5 py-1.5 rounded-[3px] bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3 h-3" /> {active.country} Quick Links & Info
                      </span>
                      {showCountryPanel ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    {showCountryPanel && (
                      <div className="mt-1.5 p-2.5 bg-sky-50/50 border border-sky-200 rounded-[3px] space-y-1.5">
                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                          <a href={`https://${active.domain}/admin`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-sky-200 text-sky-800 hover:bg-sky-100 transition-colors">
                            <ExternalLink className="w-2.5 h-2.5" /> Shopify Admin
                          </a>
                          <a href={`https://${active.domain}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-sky-200 text-sky-800 hover:bg-sky-100 transition-colors">
                            <ExternalLink className="w-2.5 h-2.5" /> Live Store
                          </a>
                          <a href="https://docs.google.com/spreadsheets/d/1KDjoXEFPyezZoG9Cxvgn1LTNBrRrKmKoLjQd963BVSs/edit?gid=2016016033#gid=2016016033" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-sky-200 text-sky-800 hover:bg-sky-100 transition-colors">
                            <ExternalLink className="w-2.5 h-2.5" /> PM Sheet
                          </a>
                          <a href="https://parcelpanel.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-sky-200 text-sky-800 hover:bg-sky-100 transition-colors">
                            <ExternalLink className="w-2.5 h-2.5" /> Parcel Panel
                          </a>
                        </div>
                        <div className="text-[10px] text-sky-700 bg-white px-2 py-1.5 rounded border border-sky-200 space-y-0.5">
                          <div><span className="font-semibold">Currency:</span> {active.currency}</div>
                          <div><span className="font-semibold">Language:</span> {active.language}</div>
                          <div><span className="font-semibold">Shipping:</span> Free Express (all stores)</div>
                          <div><span className="font-semibold">Theme:</span> Impulse</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Stage-by-Stage Task List */}
                <div className="space-y-2 max-h-[52vh] overflow-y-auto pr-1">
                  {currentTasks.map((task, idx) => {
                    const totalSubs = task.children ? task.children.length : 1;
                    const completedSubs = task.children
                      ? task.children.filter((c) => c.completed).length
                      : task.completed ? 1 : 0;
                    const isStageComplete = task.completed || (task.children && task.children.length > 0 && completedSubs === totalSubs);
                    const isInProgress = !isStageComplete && completedSubs > 0;
                    const isCollapsed = collapsedTasks[task.id];
                    const stagePct = totalSubs > 0 ? Math.round((completedSubs / totalSubs) * 100) : 0;

                    return (
                      <div
                        key={task.id}
                        className={`border rounded-[4px] transition-all overflow-hidden ${
                          isStageComplete
                            ? "bg-emerald-50/40 border-emerald-200"
                            : task.isCritical && !isStageComplete
                            ? "bg-white border-rose-200 hover:border-rose-300"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {/* Stage Header Row */}
                        <div className="p-2.5 flex items-center justify-between gap-2 cursor-pointer select-none">
                          <div
                            onClick={() => toggleTask(task.id)}
                            className="flex items-center gap-2.5 flex-1 min-w-0"
                          >
                            {/* Status Circle */}
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                                isStageComplete
                                  ? "bg-emerald-500 text-white"
                                  : task.isCritical
                                  ? "bg-rose-100 text-rose-700 border border-rose-300"
                                  : "bg-slate-100 text-slate-600 border border-slate-300"
                              }`}
                            >
                              {isStageComplete ? <Check className="w-3 h-3" strokeWidth={3} /> : idx + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                              <span
                                className={`text-xs font-semibold truncate flex items-center gap-1.5 ${
                                  isStageComplete ? "text-emerald-700" : "text-slate-800"
                                }`}
                              >
                                <span className={isStageComplete ? "line-through" : ""}>{task.title}</span>
                                {task.isCritical && (
                                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide shrink-0">
                                    Critical
                                  </span>
                                )}
                              </span>
                              {/* Mini progress bar per stage */}
                              {!isStageComplete && stagePct > 0 && (
                                <div className="w-full bg-slate-100 rounded-full h-0.5 mt-1">
                                  <div className="h-0.5 rounded-full bg-amber-400 transition-all" style={{ width: `${stagePct}%` }} />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Counter + Actions + Collapse */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {task.children && task.children.length > 0 && (
                              <span
                                className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-[3px] ${
                                  isStageComplete ? "bg-emerald-100 text-emerald-700"
                                  : isInProgress ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {completedSubs}/{totalSubs}
                              </span>
                            )}
                            {task.children && task.children.length > 0 && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); toggleCollapseTask(task.id); }}
                                className="text-slate-400 hover:text-slate-700 p-0.5 transition-colors"
                              >
                                {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
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
                                <div className="flex-1 min-w-0">
                                  <span
                                    className={`text-[11px] leading-tight transition-colors ${
                                      sub.completed ? "line-through text-emerald-600" : "text-slate-600 group-hover:text-slate-900"
                                    }`}
                                  >
                                    {sub.title}
                                  </span>
                                  {sub.completed && sub.completedAt && (
                                    <span className="text-[9px] text-slate-400 ml-1.5">
                                      {new Date(sub.completedAt).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </label>
                            ))}
                            {/* Quick Actions Row */}
                            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={() => toggleMarkAllDone(task.id)}
                                className="text-[10px] font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Check className="w-3 h-3" /> {isStageComplete ? "Unmark All" : "Mark All Done"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingNoteTaskId(editingNoteTaskId === task.id ? null : task.id)}
                                className="text-[10px] font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors"
                                title="Add a quick note for this stage"
                              >
                                {task.stageNote ? "\u{1F4DD} Edit Note" : "+ Note"}
                              </button>
                            </div>
                            {/* Stage Note */}
                            {editingNoteTaskId === task.id && (
                              <div className="pt-1">
                                <textarea
                                  rows={2}
                                  value={task.stageNote || ""}
                                  onChange={(e) => saveStageNote(task.id, e.target.value)}
                                  placeholder="Quick note for this stage..."
                                  className="w-full px-2 py-1 text-[10px] rounded-[3px] border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none"
                                />
                              </div>
                            )}
                            {task.stageNote && editingNoteTaskId !== task.id && (
                              <div className="text-[10px] text-slate-500 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                                {"\u{1F4DD}"} {task.stageNote}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add Custom Task & Actions */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2">
                  <form onSubmit={handleAddCustomTask} className="flex gap-1.5">
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
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={resetStoreTasks}
                      className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                    {progress.percent === 100 && (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> All Done! Ready for QA
                      </span>
                    )}
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

      {showUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-[4px] p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-slate-900" strokeWidth={2} />
                <h3 className="text-base font-bold text-slate-900">
                  {currentUser ? "Switch User Profile" : "Welcome to Empire Production Hub"}
                </h3>
              </div>
              {currentUser && (
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Enter your Name & Email. Your stores and history stay automatically saved to your profile.
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
              <div className="pt-2 flex gap-2">
                {currentUser && (
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowUserModal(false)} className="flex-1">
                    Cancel
                  </Button>
                )}
                <Button type="submit" variant="default" size="sm" className="flex-1">
                  {currentUser ? "Switch Account" : "Get Started"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modern In-App Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-[6px] p-5 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{confirmAction.title}</h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">{confirmAction.message}</p>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmAction(null)}
                className="text-xs h-8 px-3"
              >
                Cancel
              </Button>
              <Button
                variant={confirmAction.isDestructive ? "destructive" : "default"}
                size="sm"
                onClick={confirmAction.onConfirm}
                className="text-xs h-8 px-3.5"
              >
                {confirmAction.confirmText || "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}