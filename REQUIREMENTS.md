# Store Prompt Toolkit — Requirements

## 🎯 Problem
Every day new stores come in. For each store I have to:
1. Open notepad
2. Manually replace store name, company, address, email, domain, country, language
3. Update each prompt template one by one
4. Then copy-paste into ChatGPT/Claude
5. **Too much time wasted on manual work!**

## 💡 Solution
**One simple HTML tool:**
1. Fill a form with new store details (one time)
2. Tool auto-fills ALL prompt templates for that store
3. Shows "Things to Remember" notes for that store
4. One-click copy → paste in ChatGPT → done!

---

## 📋 Store Info Fields (Form)
Each store needs these details:
| Field | Example (Poland) | Example (Denmark) |
|-------|------------------|--------------------|
| Store Name | Luminari | Luminari |
| Company Name | Luminari sp. z o.o. | Luminari ApS |
| Address | ul. Chorzowska 107, 40-101 Katowice, Polska | (Denmark address) |
| Email | pomoc@luminarikatowice.com | (Denmark email) |
| Domain | luminarikatowice.com | (domain.dk) |
| Country | Poland | Denmark |
| Language | Polish | Danish |
| Currency | PLN | DKK |
| Hours | Monday–Friday, 9:00 a.m.–5:00 p.m. | Same |

---

## 📝 Prompt Templates (Auto-Fill)

### 1. Image Transform — Person + Background Replace
```
Transform the uploaded reference image into a new photorealistic scene.
Replace the original person completely with a new person naturally matching [COUNTRY],
including facial features, skin tone, hair, clothing style, and overall cultural appearance.

Replace the background/environment with [COUNTRY] and make it visually authentic to that place.

Preserve the original image's composition, pose, framing, camera angle, lighting,
depth of field, and overall visual quality.

Do not retain the original person's identity or appearance.

Keep the result realistic, natural, professional, and seamless.
```

### 2. Brand/Logo Remove & Clean
```
Remove all visible brand names, logos, labels, text, and watermarks from this image.

Replace them with clean, generic, unbranded versions.

Keep the product, composition, angle, lighting, and design unchanged.

Make the overall look clean, premium, realistic, and naturally Scandinavian/Danish style.

If any seasonal elements exist, make them summer.

No new logos, text, or unnecessary design changes.
```

### 3. Cart Drawer Setup (USA Reference)
```
Cart drawer setup — follow https://egleboutique.com/ as reference.

Use the same payment icons and cart text layout as shown on that website.

Store: [STORE NAME]
Country: USA (cart drawer reference only)

Apply the same structure, icons, and text style.
```

### 4. Page Create Guide (Translate + Adapt)
```
When I give you a reference page, naturally translate and adapt it for **[STORE NAME]**
using the store information below.

**Store Info:**
- Store Name: [STORE NAME]
- Company: [COMPANY NAME]
- Address: [ADDRESS]
- Email: [EMAIL]
- Domain: [DOMAIN]
- Service Hours: [HOURS]

Replace all reference-specific brand, company, contact, address, domain details
with my store info above. Skip unavailable info and do not invent anything.

Keep original structure and meaning, write in natural local **[LANGUAGE]**.
Remove reference-specific wording.

Use **26px for headings** and **14px for paragraphs**.

**Country verification:** For payment methods, shipping, currencies, taxes,
or other country-specific info, verify they are suitable for **[COUNTRY]**
before including them. Remove options that belong to another country.
```

### 5. Small Text Translate with Table
```
When I give you text in any language, first understand its English meaning internally,
then translate it into the most natural local **[LANGUAGE]** for **[STORE NAME]**
in **[COUNTRY]**.

Keep the wording simple, natural, and local, like a real native speaker.
Do not translate word-for-word. Do not add, remove, or invent info.
Keep original meaning and tone.

Show the original input and its English meaning in a clean table.
Then give each translation separately in its own copyable code block
so each one has its own copy icon.
```

### 6. China Keyword Removal
```
Remove all references to China from the following text/product listing:

Banned keywords to find and remove:
China, Made in China, Chinese, China origin, Manufactured in China, Shenzhen,
Factory direct, Chinese supplier, AliExpress, AliBaba, Taobao, Global Sources,
Dropshipping, Wholesale China, Direct from China, Chinese factory, Chinese goods,
China wholesale, JD.com, Tmall, 1688.com, Pinduoduo, Gearbest, DHgate,
Banggood, Chinese cities

If any of these appear in product titles, descriptions, bullet points,
or any text — remove or replace them with clean, neutral alternatives.

Keep the rest of the content intact. Do not change product meaning or features.
```

### 7. Currency Formatting
**Denmark:**
```
HTML with currency: {{amount_with_comma_separator}} DKK
HTML without currency: {{amount_with_comma_separator}} kr
Email with currency: {{amount_with_comma_separator}} DKK
Email without currency: {{amount_with_comma_separator}} kr
```
**Poland:**
```
Use PLN for all currency displays.
Apply proper Polish formatting.
```

---

## 📌 Things to Remember (Per Store Notes)
Each store may have special notes, like:
- "Shipping always free"
- "Bilingual store (Bangla + English)"
- "Focus on SEO"
- "Cart drawer from egleboutique.com reference"
- "Verify payment methods are available in [COUNTRY]"
- "Logo and brand name must replace ALL reference brand info"

---

## 🛠️ Tool Requirements

### UI Layout (Simple!)
```
┌──────────────────────────────────────┐
│         Store Prompt Toolkit         │
│  Select store → Pick → Copy → Done   │
├──────────────────────────────────────┤
│  [🇵🇱 Poland] [🇩🇰 Denmark] [+ Add]  │
├──────────────────────────────────────┤
│  Store: Luminari | PL | luminari...  │
├──────────────────────────────────────┤
│  [Form: fill new store details]      │
├──────────────────────────────────────┤
│  [Image] [Brand] [Cart] [Page] ...   │
├──────────────────────────────────────┤
│  ┌─ Prompt Template ──────────────┐  │
│  │ Transform the uploaded...      │  │
│  │ [COUNTRY] → Poland             │  │
│  │ [STORE NAME] → Luminari        │  │
│  │                                │  │
│  │              [📋 Copy]         │  │
│  └────────────────────────────────┘  │
├──────────────────────────────────────┤
│  📌 Things to Remember:              │
│  • Shipping always free              │
│  • Verify PL payment methods         │
└──────────────────────────────────────┘
```

### Features
1. **Store Form** — fill once, save
2. **Store Selector** — switch between saved stores
3. **Template Tabs** — 7 tabs for different prompts
4. **Auto-Fill** — store info injected into all templates
5. **Copy Button** — one click, paste in ChatGPT
6. **Notes Section** — "Things to Remember" per store
7. **Simple dark UI** — no complexity

### Rules
- **NO complexity** — PM is strict
- **Single HTML file** — no build tools
- **Browser-based** — open file and use
- **Fast** — no loading, instant switching
