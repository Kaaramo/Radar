// Génère Branding/CHARTE_GRAPHIQUE_RADAR.pdf depuis le .md (Radar Editorial)
// Pipeline : marked (md→HTML) + Chrome headless (HTML→PDF)
// Usage : node Branding/_generate-charte-pdf.js

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const HERE = __dirname;
const MD = path.join(HERE, "CHARTE_GRAPHIQUE_RADAR.md");
const HTML = path.join(HERE, ".charte-tmp.html");
const PDF = path.join(HERE, "CHARTE_GRAPHIQUE_RADAR.pdf");

// Tokens RADAR Editorial (navy + royal blue) — embarqués dans la CSS
const TOKENS = {
  navy: "#051C2C",
  navy900: "#0A2540",
  navy800: "#133553",
  navy700: "#1F4868",
  royal: "#2251FF",
  royalLight: "#4F73FF",
  royalDark: "#1A3FCC",
  royalSoft: "#E5EBFF",
  bone: "#F5F1EB",
  cream: "#FAF8F3",
  ink: "#1A1A1A",
  inkSoft: "#4A4A4A",
  muted: "#8FA3B8",
  mutedSoft: "#6B7280",
  border: "#E5E7EB",
  success: "#0F8F65",
  warning: "#C77700",
  error: "#B42318",
};

// 1. Charge marked (auto-installé via pnpm si absent du node_modules global)
let marked;
try {
  marked = require("marked");
} catch {
  console.log("marked absent — installation locale...");
  execSync("npm install marked --no-save --prefix " + HERE, {
    stdio: "inherit",
  });
  marked = require(path.join(HERE, "node_modules/marked"));
}

const mdContent = fs.readFileSync(MD, "utf8");
const htmlBody = marked.parse ? marked.parse(mdContent) : marked(mdContent);

// CSS éditoriale McKinsey-fit pour rendu PDF (light mode pour impression)
const css = `
  @page { size: A4; margin: 18mm 16mm 22mm 16mm; }
  :root {
    --navy: ${TOKENS.navy};
    --royal: ${TOKENS.royal};
    --royal-soft: ${TOKENS.royalSoft};
    --ink: ${TOKENS.ink};
    --ink-soft: ${TOKENS.inkSoft};
    --muted: ${TOKENS.mutedSoft};
    --border: ${TOKENS.border};
    --bone: ${TOKENS.bone};
    --cream: ${TOKENS.cream};
  }
  * { box-sizing: border-box; }
  html, body { background: ${TOKENS.cream}; color: var(--ink); }
  body {
    font-family: 'Inter', -apple-system, 'Segoe UI', sans-serif;
    font-size: 11pt;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  h1, h2, h3, h4 {
    font-family: 'Fraunces', 'Times New Roman', serif;
    color: var(--navy);
    font-weight: 400;
    letter-spacing: -0.01em;
    page-break-after: avoid;
  }
  h1 {
    font-size: 28pt;
    margin: 0 0 6pt 0;
    line-height: 1.15;
    border-bottom: 1px solid var(--border);
    padding-bottom: 8pt;
  }
  h2 {
    font-size: 18pt;
    margin: 22pt 0 10pt 0;
    line-height: 1.2;
    page-break-before: auto;
  }
  h3 { font-size: 13pt; margin: 16pt 0 6pt 0; font-weight: 600; font-family: 'Inter', sans-serif; color: var(--ink); }
  h4 { font-size: 11pt; margin: 10pt 0 4pt 0; font-weight: 600; font-family: 'Inter', sans-serif; }
  p { margin: 0 0 8pt 0; }
  blockquote {
    margin: 12pt 0;
    padding: 8pt 14pt;
    border-left: 3px solid var(--royal);
    background: var(--royal-soft);
    color: var(--ink);
    font-style: italic;
  }
  blockquote p { margin: 0; }
  hr { border: none; border-top: 1px solid var(--border); margin: 16pt 0; }
  a { color: var(--royal); text-decoration: none; }
  code {
    font-family: 'JetBrains Mono', 'Consolas', monospace;
    font-size: 9.5pt;
    background: ${TOKENS.bone};
    padding: 1px 4px;
    border-radius: 3px;
    color: var(--ink);
  }
  pre {
    font-family: 'JetBrains Mono', 'Consolas', monospace;
    font-size: 9pt;
    background: ${TOKENS.navy};
    color: ${TOKENS.bone};
    padding: 10pt 12pt;
    border-radius: 4px;
    overflow-x: auto;
    line-height: 1.5;
    page-break-inside: avoid;
  }
  pre code { background: transparent; color: inherit; padding: 0; }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 8pt 0 12pt 0;
    font-size: 10pt;
    page-break-inside: avoid;
  }
  th, td {
    border: 1px solid var(--border);
    padding: 5pt 8pt;
    text-align: left;
    vertical-align: top;
  }
  th {
    background: ${TOKENS.bone};
    font-weight: 600;
    color: var(--navy);
    font-family: 'Inter', sans-serif;
    font-size: 9.5pt;
    letter-spacing: 0.01em;
  }
  td code { font-size: 9pt; }
  ul, ol { margin: 4pt 0 10pt 0; padding-left: 18pt; }
  li { margin-bottom: 3pt; }
  strong { color: var(--navy); font-weight: 600; }
  em { color: var(--ink-soft); }
  /* Cadre couleur (cellules contenant des hex) */
  td:has(code) code { font-family: 'JetBrains Mono', monospace; font-size: 9pt; }
  /* Page de garde (premier h1) */
  body > h1:first-child { font-size: 36pt; margin-top: 8pt; }
  /* Premier blockquote sous h1 = signature */
  body > h1:first-child + blockquote {
    background: transparent;
    border-left: 3px solid var(--royal);
    color: var(--ink-soft);
    font-style: normal;
    margin-bottom: 18pt;
  }
  /* Footer signature */
  .footer-signature {
    margin-top: 24pt;
    padding-top: 10pt;
    border-top: 1px solid var(--border);
    font-size: 9pt;
    color: var(--muted);
  }
`;

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>RADAR — Charte Graphique</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>${css}</style>
</head>
<body>
${htmlBody}
</body>
</html>
`;

fs.writeFileSync(HTML, html, "utf8");
console.log(`[OK] HTML genere : ${HTML}`);

// 2. Lance Chrome headless pour convertir HTML → PDF
const chromePaths = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];
const chrome = chromePaths.find((p) => fs.existsSync(p));
if (!chrome) {
  console.error("Chrome / Edge introuvable. Installer Chrome ou Edge.");
  process.exit(1);
}
console.log(`[OK] Browser : ${chrome}`);

const cmd = `"${chrome}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${PDF}" --print-to-pdf-no-header "file:///${HTML.replace(/\\/g, "/")}"`;
execSync(cmd, { stdio: "inherit" });

// 3. Cleanup HTML temp
fs.unlinkSync(HTML);

const stat = fs.statSync(PDF);
console.log(`[OK] PDF genere : ${PDF}  (${stat.size} bytes)`);
