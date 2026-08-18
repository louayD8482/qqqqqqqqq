var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_jszip = __toESM(require("jszip"), 1);
var import_genai = require("@google/genai");
var import_vite = require("vite");
var app = (0, import_express.default)();
app.use(import_express.default.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(import_express.default.static(import_path.default.join(process.cwd(), "public")));
var PORT = 3e3;
var aiClient = null;
function getAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new import_genai.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}
app.post("/api/ai-chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }
    const ai = getAI();
    if (!ai) {
      const lower = prompt.toLowerCase();
      let fallback = "\u0623\u0647\u0644\u0627\u064B \u0628\u0643 \u0623\u062E\u064A \u0627\u0644\u0643\u0631\u064A\u0645 \u0641\u064A \u0646\u0648\u0631 \u0627\u0644\u0625\u0633\u0644\u0627\u0645. \u0646\u0633\u0639\u062F \u0628\u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u0639\u0644\u0649 \u0627\u0633\u062A\u0641\u0633\u0627\u0631\u0627\u062A\u0643 \u0627\u0644\u0634\u0631\u0639\u064A\u0629 \u0648\u0627\u0644\u062A\u0631\u0628\u0648\u064A\u0629 \u0648\u0627\u0644\u0642\u0631\u0622\u0646\u064A\u0629.";
      if (lower.includes("\u0648\u0636\u0648\u0621") || lower.includes("\u0637\u0647\u0627\u0631\u0629")) {
        fallback = "\u0635\u0641\u0629 \u0627\u0644\u0648\u0636\u0648\u0621 \u0627\u0644\u0643\u0627\u0645\u0644: \u0627\u0644\u0646\u064A\u0629\u060C \u062B\u0645 \u0627\u0644\u062A\u0633\u0645\u064A\u0629\u060C \u062B\u0645 \u063A\u0633\u0644 \u0627\u0644\u0643\u0641\u064A\u0646 \u062B\u0644\u0627\u062B\u0627\u064B\u060C \u062B\u0645 \u0627\u0644\u0645\u0636\u0645\u0636\u0629 \u0648\u0627\u0644\u0627\u0633\u062A\u0646\u0634\u0627\u0642 \u062B\u0644\u0627\u062B\u0627\u064B\u060C \u062B\u0645 \u063A\u0633\u0644 \u0627\u0644\u0648\u062C\u0647 \u062B\u0644\u0627\u062B\u0627\u064B\u060C \u062B\u0645 \u063A\u0633\u0644 \u0627\u0644\u064A\u062F\u064A\u0646 \u0625\u0644\u0649 \u0627\u0644\u0645\u0631\u0641\u0642\u064A\u0646 \u062B\u0644\u0627\u062B\u0627\u064B (\u0628\u062F\u0621\u0627\u064B \u0628\u0627\u0644\u064A\u0645\u0646\u0649)\u060C \u062B\u0645 \u0645\u0633\u062D \u0627\u0644\u0631\u0623\u0633 \u0648\u0627\u0644\u0623\u0630\u0646\u064A\u0646 \u0645\u0631\u0629 \u0648\u0627\u062D\u062F\u0629\u060C \u062B\u0645 \u063A\u0633\u0644 \u0627\u0644\u0631\u062C\u0644\u064A\u0646 \u0625\u0644\u0649 \u0627\u0644\u0643\u0639\u0628\u064A\u0646 \u062B\u0644\u0627\u062B\u0627\u064B.";
      } else if (lower.includes("\u0635\u0644\u0627\u0629") || lower.includes("\u0631\u0643\u0639\u0627\u062A")) {
        fallback = "\u0627\u0644\u0635\u0644\u0648\u0627\u062A \u0627\u0644\u0645\u0641\u0631\u0648\u0636\u0629 \u062E\u0645\u0633 \u0641\u064A \u0627\u0644\u064A\u0648\u0645 \u0648\u0627\u0644\u0644\u064A\u0644\u0629: \u0627\u0644\u0641\u062C\u0631 (\u0631\u0643\u0639\u062A\u0627\u0646 \u062C\u0647\u0631\u064A\u0629)\u060C \u0627\u0644\u0638\u0647\u0631 (\u0623\u0631\u0628\u0639 \u0631\u0643\u0639\u0627\u062A \u0633\u0631\u064A\u0629)\u060C \u0627\u0644\u0639\u0635\u0631 (\u0623\u0631\u0628\u0639 \u0631\u0643\u0639\u0627\u062A \u0633\u0631\u064A\u0629)\u060C \u0627\u0644\u0645\u063A\u0631\u0628 (\u062B\u0644\u0627\u062B \u0631\u0643\u0639\u0627\u062A: \u0631\u0643\u0639\u062A\u0627\u0646 \u062C\u0647\u0631\u0627\u064B \u0648\u0648\u0627\u062D\u062F\u0629 \u0633\u0631\u0627\u064B)\u060C \u0627\u0644\u0639\u0634\u0627\u0621 (\u0623\u0631\u0628\u0639 \u0631\u0643\u0639\u0627\u062A: \u0631\u0643\u0639\u062A\u0627\u0646 \u062C\u0647\u0631\u0627\u064B \u0648\u0631\u0643\u0639\u062A\u0627\u0646 \u0633\u0631\u0627\u064B).";
      } else if (lower.includes("\u0627\u0633\u062A\u063A\u0641\u0627\u0631") || lower.includes("\u062A\u0648\u0628\u0629")) {
        fallback = "\u0645\u0646 \u0635\u064A\u063A \u0627\u0644\u0627\u0633\u062A\u063A\u0641\u0627\u0631 \u0627\u0644\u0639\u0638\u064A\u0645\u0629: \xAB\u0633\u064A\u062F \u0627\u0644\u0627\u0633\u062A\u063A\u0641\u0627\u0631: \u0627\u0644\u0644\u064E\u0651\u0647\u064F\u0645\u064E\u0651 \u0623\u064E\u0646\u0652\u062A\u064E \u0631\u064E\u0628\u0650\u0651\u064A \u0644\u0627\u064E \u0625\u0650\u0644\u064E\u0647\u064E \u0625\u0650\u0644\u064E\u0651\u0627 \u0623\u064E\u0646\u0652\u062A\u064E\u060C \u062E\u064E\u0644\u064E\u0642\u0652\u062A\u064E\u0646\u0650\u064A \u0648\u064E\u0623\u064E\u0646\u064E\u0627 \u0639\u064E\u0628\u0652\u062F\u064F\u0643\u064E...\xBB\u060C \u0648\u0642\u064E\u0627\u0644\u064E \u0627\u0644\u0646\u0628\u064A \uFDFA: \xAB\u0645\u064E\u0646\u0652 \u0644\u064E\u0632\u0650\u0645\u064E \u0627\u0644\u0650\u0627\u0633\u0652\u062A\u0650\u063A\u0652\u0641\u064E\u0627\u0631\u064E \u062C\u064E\u0639\u064E\u0644\u064E \u0627\u0644\u0644\u064E\u0651\u0647\u064F \u0644\u064E\u0647\u064F \u0645\u0650\u0646\u0652 \u0643\u064F\u0644\u0650\u0651 \u0636\u0650\u064A\u0642\u064D \u0645\u064E\u062E\u0652\u0631\u064E\u062C\u064B\u0627\u060C \u0648\u064E\u0645\u0650\u0646\u0652 \u0643\u064F\u0644\u0650\u0651 \u0647\u064E\u0645\u064D\u0651 \u0641\u064E\u0631\u064E\u062C\u064B\u0627\xBB.";
      } else if (lower.includes("\u0641\u0636\u0644") || lower.includes("\u062A\u0633\u0628\u064A\u062D")) {
        fallback = "\u0642\u0627\u0644 \u0631\u0633\u0648\u0644 \u0627\u0644\u0644\u0647 \uFDFA: \xAB\u0643\u064E\u0644\u0650\u0645\u064E\u062A\u064E\u0627\u0646\u0650 \u062E\u064E\u0641\u0650\u064A\u0641\u064E\u062A\u064E\u0627\u0646\u0650 \u0639\u064E\u0644\u064E\u0649 \u0627\u0644\u0644\u0650\u0651\u0633\u064E\u0627\u0646\u0650\u060C \u062B\u064E\u0642\u0650\u064A\u0644\u064E\u062A\u064E\u0627\u0646\u0650 \u0641\u0650\u064A \u0627\u0644\u0652\u0645\u0650\u064A\u0632\u064E\u0627\u0646\u0650\u060C \u062D\u064E\u0628\u0650\u064A\u0628\u064E\u062A\u064E\u0627\u0646\u0650 \u0625\u0650\u0644\u064E\u0649 \u0627\u0644\u0631\u064E\u0651\u062D\u0652\u0645\u064E\u0646\u0650: \u0633\u064F\u0628\u0652\u062D\u064E\u0627\u0646\u064E \u0627\u0644\u0644\u064E\u0651\u0647\u0650 \u0648\u064E\u0628\u0650\u062D\u064E\u0645\u0652\u062F\u0650\u0647\u0650\u060C \u0633\u064F\u0628\u0652\u062D\u064E\u0627\u0646\u064E \u0627\u0644\u0644\u064E\u0651\u0647\u0650 \u0627\u0644\u0652\u0639\u064E\u0638\u0650\u064A\u0645\u0650\xBB (\u0645\u062A\u0641\u0642 \u0639\u0644\u064A\u0647).";
      }
      return res.json({ reply: fallback });
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `\u0623\u0646\u062A \u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0634\u0631\u0639\u064A \u0627\u0644\u0630\u0643\u064A \u0644\u062A\u0637\u0628\u064A\u0642 '\u0646\u0648\u0631 \u0627\u0644\u0625\u0633\u0644\u0627\u0645'.
\u0623\u062C\u0628 \u0627\u0644\u0633\u0627\u0626\u0644 \u0628\u0623\u0633\u0644\u0648\u0628 \u0625\u0633\u0644\u0627\u0645\u064A \u0645\u0624\u062F\u0628\u060C \u0639\u0644\u0645\u064A\u060C \u0648\u0645\u0648\u062B\u0648\u0642\u060C \u0645\u0633\u062A\u0634\u0647\u062F\u0627\u064B \u0628\u0622\u064A\u0627\u062A \u0627\u0644\u0642\u0631\u0622\u0646 \u0627\u0644\u0643\u0631\u064A\u0645 \u0648\u0627\u0644\u0623\u062D\u0627\u062F\u064A\u062B \u0627\u0644\u0646\u0628\u0648\u064A\u0629 \u0627\u0644\u0635\u062D\u064A\u062D\u0629 \u0625\u0646 \u0623\u0645\u0643\u0646\u060C \u0645\u0639 \u0625\u064A\u062C\u0627\u0632 \u0645\u0631\u064A\u062D \u0644\u0644\u0642\u0631\u0627\u0621\u0629 \u0639\u0644\u0649 \u0634\u0627\u0634\u0627\u062A \u0627\u0644\u062C\u0648\u0627\u0644:

\u0627\u0644\u0633\u0624\u0627\u0644: ${prompt}`
            }
          ]
        }
      ]
    });
    res.json({ reply: response.text || "\u0648\u0641\u0642\u0643 \u0627\u0644\u0644\u0647 \u0644\u0643\u0644 \u062E\u064A\u0631 \u0648\u0628\u0648\u0631\u0643 \u0641\u064A\u0643." });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({
      reply: "\u062D\u062F\u062B \u062E\u0637\u0623 \u063A\u064A\u0631 \u0645\u062A\u0648\u0642\u0639 \u0623\u062B\u0646\u0627\u0621 \u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0633\u0624\u0627\u0644. \u064A\u0645\u0643\u0646\u0643 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649 \u0623\u0648 \u0627\u0644\u0628\u062D\u062B \u0641\u064A \u062A\u0628\u0648\u064A\u0628 \u0627\u0644\u0623\u062D\u0627\u062F\u064A\u062B \u0648\u0627\u0644\u0642\u0631\u0622\u0646."
    });
  }
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Noor Al-Islam" });
});
function addDirectoryToZip(zip, rootDir, currentDir = "") {
  const fullCurrentDir = currentDir ? import_path.default.join(rootDir, currentDir) : rootDir;
  if (!import_fs.default.existsSync(fullCurrentDir)) return;
  const items = import_fs.default.readdirSync(fullCurrentDir);
  for (const item of items) {
    if (item === "node_modules" || item === ".git" || item === "dist" || item === ".env" || item === "bun.lock") {
      continue;
    }
    const relativeItemPath = currentDir ? import_path.default.join(currentDir, item) : item;
    const fullPath = import_path.default.join(rootDir, relativeItemPath);
    const stat = import_fs.default.statSync(fullPath);
    if (stat.isDirectory()) {
      addDirectoryToZip(zip, rootDir, relativeItemPath);
    } else {
      const content = import_fs.default.readFileSync(fullPath);
      zip.file(relativeItemPath.replace(/\\/g, "/"), content);
    }
  }
}
app.get("/api/export-zip", async (req, res) => {
  try {
    const zip = new import_jszip.default();
    const projectRoot = process.cwd();
    addDirectoryToZip(zip, projectRoot, "");
    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 9 }
    });
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Subha_Nour_Al_Islam_Source_Code.zip"'
    );
    res.send(zipBuffer);
  } catch (error) {
    console.error("ZIP generation error:", error);
    res.status(500).json({ error: "Failed to generate ZIP archive" });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u0646\u0648\u0631 \u0627\u0644\u0625\u0633\u0644\u0627\u0645 Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
