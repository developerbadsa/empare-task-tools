const fs = require('fs');

const pageContent = `"use client";

import { useState, useEffect } from "react";

interface Store {
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
  notes: string;
}

const emptyStore: Store = {
  id: "", name: "", company: "", address: "", email: "",
  domain: "", country: "", language: "", currency: "",
  hours: "Monday\u2013Friday, 9:00 a.m.\u20135:00 p.m.", notes: "",
};

function getTemplates(s: Store) {
  if (!s.name) return [];
  return [
    { title: "Image Transform", icon: "\uD83D\uDDBC\uFE0F",
      text: "Transform the uploaded reference image into a new photorealistic scene. Replace the original person completely with a new person naturally matching [" + s.country + "], including facial features, skin tone, hair, clothing style, and overall cultural appearance.\n\nReplace the background/environment with [" + s.country + "] and make it visually authentic to that place.\n\nPreserve the original image\u2019s composition, pose, framing, camera angle, lighting, depth of field, and overall visual quality.\n\nDo not retain the original person\u2019s identity or appearance.\n\nKeep the result realistic, natural, professional, and seamless." },
    { title: "Brand Remove", icon: "\uD83D\uDD32",
      text: "Remove all visible brand names, logos, labels, text, and watermarks from this image.\n\nReplace them with clean, generic, unbranded versions.\n\nKeep the product, composition, angle, lighting, and design unchanged.\n\nMake the overall look clean, premium, realistic, and naturally Scandinavian/Danish style.\n\nIf any seasonal elements exist, make them summer.\n\nNo new logos, text, or unnecessary design changes." },
    { title: "Cart Drawer", icon: "\uD83D\uDED2",
      text: "Cart drawer setup \u2014 follow https://egleboutique.com/ as reference.\n\nUse the same payment icons and cart text layout as shown on that website.\n\nStore: " + s.name + "\nCountry: USA (cart drawer reference only)\n\nApply the same structure, icons, and text style." },
    { title: "Page Guide", icon: "\uD83D\uDCC4",
      text: "When I give you a reference page, naturally translate and adapt it for **" + s.name + "** using the store information below.\n\n**Store Info:**\n- Store Name: " + s.name + "\n- Company: " + s.company + "\n- Address: " + s.address + "\n- Email: " + s.email + "\n- Domain: " + s.domain + "\n- Service Hours: " + s.hours + "\n\nReplace all reference-specific brand, company, contact, address, domain details with my store info above. Skip unavailable info and do not invent anything.\n\nKeep original structure and meaning, write in natural local **" + s.language + "**. Remove reference-specific wording.\n\nUse **26px for headings** and **14px for paragraphs**.\n\n**Country verification:** For payment methods, shipping, currencies, taxes, or other country-specific info, verify they are suitable for **" + s.country + "** before including them. Remove options that belong to another country." },
    { title: "Translate Text", icon: "\uD83C\uDF10",
      text: "When I give you text in any language, first understand its English meaning internally, then translate it into the most natural local **" + s.language + "** for **" + s.name + "** in **" + s.country + "**.\n\nKeep the wording simple, natural, and local, like a real native speaker. Do not translate word-for-word. Do not add, remove, or invent info. Keep original meaning and tone.\n\nShow original input and English meaning in a clean table. Then give each translation separately in its own copyable code block so each one has its own copy icon." },
    { title: "China Remove", icon: "\uD83D\uDDD1\uFE0F",
      text: "Remove all references to China from the following text/product listing:\n\nBanned keywords to find and remove:\nChina, Made in China, Chinese, China origin, Manufactured in China, Shenzhen, Factory direct, Chinese supplier, AliExpress, AliBaba, Taobao, Global Sources, Dropshipping, Wholesale China, Direct from China, Chinese factory, Chinese goods, China wholesale, JD.com, Tmall, 1688.com, Pinduoduo, Gearbest, DHgate, Banggood, Chinese cities\n\nIf any of these appear in product titles, descriptions, bullet points, or any text \u2014 remove or replace them with clean, neutral alternatives.\n\nKeep the rest of the content intact. Do not change product meaning or features." },
    { title: "Currency", icon: "\uD83D\uDCB1",
      text: s.currency === "DKK"
        ? "Denmark Market Currency Formatting:\n\nHTML with currency: {{amount_with_comma_separator}} DKK\nHTML without currency: {{amount_with_comma_separator}} kr\nEmail with currency: {{amount_with_comma_separator}} DKK\nEmail without currency: {{amount_with_comma_separator}} kr\n\nUse these exact formats in all " + s.name + " templates for " + s.country + "."
        : "Poland Market Currency Formatting:\n\nUse PLN for all currency displays.\n\nApply proper Polish formatting for " + s.name + " (" + s.country + ")." },
  ];
}

export default function Home() {
  const [stores, setStores] = useState<Store[]>([]);
  const [activeStoreId, setActiveStoreId] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Store>({ ...emptyStore });

  useEffect(() => {
    const saved = localStorage.getItem("store-toolkit-data");
    if (saved) {
      const data = JSON.parse(saved);
      setStores(data.stores || []);
      setActiveStoreId(data.activeStoreId || "");
    }
  }, []);

  useEffect(() => {
    if (stores.length > 0 || activeStoreId) {
      localStorage.setItem("store-toolkit-data", JSON.stringify({ stores, activeStoreId }));
    }
  }, [stores, activeStoreId]);

  const activeStore = stores.find((s) => s.id === activeStoreId) || null;
  const templates = activeStore ? getTemplates(activeStore) : [];

  function addStore() {
    const id = Date.now().toString();
    setStores([...stores, { ...formData, id }]);
    setActiveStoreId(id);
    setFormData({ ...emptyStore });
    setShowForm(false);
  }

  function updateStore() {
    setStores(stores.map((s) => (s.id === formData.id ? formData : s)));
    setFormData({ ...emptyStore });
    setShowForm(false);
  }

  function deleteStore(id: string) {
    if (!confirm("Delete this store?")) return;
    const next = stores.filter((s) => s.id !== id);
    setStores(next);
    if (activeStoreId === id) setActiveStoreId(next[0]?.id || "");
  }

  function editStore(store: Store) { setFormData({ ...store }); setShowForm(true); }

  function copyPrompt(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  const fields = [
    { key: "name", label: "Store Name", required: true },
    { key: "company", label: "Company Name", required: true },
    { key: "address", label: "Address" },
    { key: "email", label: "Email" },
    { key: "domain", label: "Domain" },
    { key: "country", label: "Country", required: true },
    { key: "language", label: "Language", required: true },
    { key: "currency", label: "Currency (PLN/DKK)", required: true },
    { key: "hours", label: "Service Hours" },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-1 bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Store Prompt Toolkit</h1>
        <p className="text-center text-slate-500 text-sm mb-6">Select store &rarr; Pick template &rarr; Copy &rarr; Paste in ChatGPT</p>

        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {stores.map((s) => (
            <button key={s.id} onClick={() => { setActiveStoreId(s.id); setActiveTab(0); }}
              className={"px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all " + (activeStoreId === s.id ? "bg-sky-500/10 bord
