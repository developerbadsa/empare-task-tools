const fs = require('fs');

const content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Store Prompt Toolkit</title>
    <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif; background:#0f172a; color:#e2e8f0; min-height:100vh; }
        .container { max-width:960px; margin:0 auto; padding:24px 20px; }
        h1 { text-align:center; font-size:1.8rem; margin-bottom:6px; background:linear-gradient(90deg,#38bdf8,#818cf8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .subtitle { text-align:center; color:#64748b; margin-bottom:24px; font-size:0.88rem; }
        .store-selector { display:flex; gap:10px; align-items:center; justify-content:center; margin-bottom:24px; flex-wrap:wrap; }
        .store-btn { padding:10px 24px; border-radius:8px; border:2px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.04); color:#94a3b8; font-weight:600; cursor:pointer; transition:all 0.2s; font-size:0.9rem; }
        .store-btn:hover { border-color:#38bdf8; color:#e2e8f0; }
        .store-btn.active { background:rgba(56,189,248,0.12); border-color:#38bdf8; color:#38bdf8; }
        .store-info { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:16px 20px; margin-bottom:24px; font-size:0.82rem; color:#94a3b8; line-height:1.7; }
        .store-info strong { color:#e2e8f0; }
        .store-info .tag { display:inline-block; background:rgba(56,189,248,0.12); color:#38bdf8; padding:2px 8px; border-radius:4px; font-weight:600; margin-left:4px; }
        .tabs { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:20px; }
        .tab { padding:8px 16px; border-radius:6px; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.03); color:#94a3b8; cursor:pointer; font-size:0.82rem; font-weight:500; transition:all 0.2s; }
        .tab:hover { border-color:#818cf8; color:#e2e8f0; }
        .tab.active { background:rgba(129,140,248,0.12); border-color:#818cf8; color:#818cf8; }
        .prompt-card { display:none; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); border-radius:10px; overflow:hidden; }
        .prompt-card.active { display:block; }
        .prompt-header { display:flex; justify-content:space-between; align-items:center; padding:14px 20px; border-bottom:1px solid rgba(255,255,255,0.06); }
        .prompt-header h3 { font-size:0.95rem; color:#e2e8f0; }
        .copy-btn { padding:7px 18px; background:rgba(52,211,153,0.12); border:1px solid rgba(52,211,153,0.3); color:#34d399; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.82rem; transition:all 0.2s; }
        .copy-btn:hover { background:rgba(52,211,153,0.2); }
        .copy-btn.copied { background:rgba(52,211,153,0.2); color:#10b981; }
        .prompt-body { padding:20px; }
        .prompt-text { font-family:'Courier New',monospace; font-size:0.84rem; line-height:1.75; color:#cbd5e1; white-space:pre-wrap; word-wrap:break-word; background:rgba(0,0,0,0.25); border-radius:8px; padding:18px; }
        @media (max-width:600px) { h1 { font-size:1.4rem; } .tabs { gap:4px; } .tab { padding:6px 10px; font-size:0.75rem; } }
    </style>
</head>
<body>
<div class="container">
    <h1>\u{1F6CD}\uFE0F Store Prompt Toolkit</h1>
    <p class="subtitle">Select store \u2192 Pick template \u2192 Copy \u2192 Paste in ChatGPT / Claude</p>
    <div class="store-selector">
        <button class="store-btn active" onclick="switchStore('luminari')">\u{1F1F5}\u{1F1F1} Luminari (Poland)</button>
        <button class="store-btn" onclick="switchStore('denmark')">\u{1F1E9}\u{1F1F0} Luminari (Denmark)</button>
    </div>
    <div class="store-info" id="storeInfo"></div>
    <div class="tabs">
        <button class="tab active" onclick="switchTab(0)">Image Transform</button>
        <button class="tab" onclick="switchTab(1)">Brand Remove</button>
        <button class="tab" onclick="switchTab(2)">Cart Drawer</button>
        <button class="tab" onclick="switchTab(3)">Page Guide</button>
        <button class="tab" onclick="switchTab(4)">Translate Text</button>
        <button class="tab" onclick="switchTab(5)">China Remove</button>
        <button class="tab" onclick="switchTab(6)">Currency</button>
    </div>
    <div id="promptCards"></div>
</div>
<script>
const stores = {
    luminari: {name:"Luminari",company:"Luminari sp. z o.o.",address:"ul. Chorzowska 107, 40-101 Katowice, Polska",email:"pomoc@luminarikatowice.com",hours:"Monday\u2013Friday, 9:00 a.m.\u20135:00 p.m.",domain:"luminarikatowice.com",country:"Poland",lang:"Polish",currency:"PLN"},
    denmark: {name:"Luminari",company:"Luminari ApS",address:"Fill in Denmark address",email:"Fill in email",hours:"Monday\u2013Friday, 9:00 a.m.\u20135:00 p.m.",domain:"Fill in domain.dk",country:"Denmark",lang:"Danish",currency:"DKK"}
};
let currentStore = 'luminari', currentTab = 0;

function getTemplates(s) {
    const st = stores[s];
    return [
    { title: "Image Transform \u2014 Person + Background Replace",
      text: "Transform the uploaded reference image into a new photorealistic scene. Replace the original person completely with a new person naturally matching [" + st.country + "], including facial features, skin tone, hair, clothing style, and overall cultural appearance.\n\nReplace the background/environment with [" + st.country + "] and make it visually authentic to that place.\n\nPreserve the original image's composition, pose, framing, camera angle, lighting, depth of field, and overall visual quality.\n\nDo not retain the original person's identity or appearance.\n\nKeep the result realistic, natural, professional, and seamless."
    },
    { title: "Brand/Logo Remove & Clean",
      text: "Remove all visible brand names, logos, labels, text, and watermarks from this image.\n\nReplace them with clean, generic, unbranded versions.\n\nKeep the product, composition, angle, lighting, and design unchanged.\n\nMake the overall look clean, premium, realistic, and naturally Scandinavian/Danish style.\n\nIf any seasonal elements exist, make them summer.\n\nNo new logos, text, or unnecessary design changes."
    },
    { title: "Cart Drawer Setup (USA Reference)",
      text: "Cart drawer setup \u2014 follow https://egleboutique.com/ as reference.\n\nUse the same payment icons and cart text layout as shown on that website.\n\nStore: " + st.name + "\nCountry: USA (cart drawer reference only)\n\nApply the same structure, icons, and text style."
    },
    { title: "Page Create Guide (Translate + Adapt)",
      text: "When I give you a reference page, naturally translate and adapt it for **" + st.name + "** using the store information below.\n\n**Store Info:**\n- Store Name: " + st.name + "\n- Company: " + st.company + "\n- Address: " + st.address + "\n- Email: " + st.email + "\n- Domain: " + st.domain + "\n- Service Hours: " + st.hours + "\n\nReplace all reference-specific brand, company, contact, address, domain details with my store info above. Skip unavailable info and do not invent anything.\n\nKeep original structure and meaning, write in natural local **" + st.lang + "**. Remove reference-specific wording.\n\nUse **26px for headings** and **14px for paragraphs**.\n\n**Country verification:** For payment methods, shipping, currencies, taxes, or other country-specific info, verify they are suitable for **" + st.country + "** before including them."
    },
    { title: "Small Text Translate with Table",
      text: "When I give you text in any language, first understand its English meaning internally, then translate it into the most natural local **" + st.lang + "** for **" + st.name + "** in **" + st.country + "**.\n\nKeep the wording simple, natural, and local, like a real native speaker. Do not translate word-for-word. Do not add, remove, or invent info. Keep original meaning and tone.\n\nShow original input and English meaning in a clean table. Then give each translation in its own copyable cod
