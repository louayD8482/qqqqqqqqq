import express from "express";
import path from "path";
import fs from "fs";
import JSZip from "jszip";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
app.use(express.json());

// CORS & Mobile WebView support
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.static(path.join(process.cwd(), "public")));
const PORT = 3000;

let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// 1. AI Islamic Assistant Endpoint
app.post("/api/ai-chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getAI();
    if (!ai) {
      // Graceful offline scholarly responses based on keywords
      const lower = prompt.toLowerCase();
      let fallback = "أهلاً بك أخي الكريم في نور الإسلام. نسعد بالإجابة على استفساراتك الشرعية والتربوية والقرآنية.";
      if (lower.includes("وضوء") || lower.includes("طهارة")) {
        fallback = "صفة الوضوء الكامل: النية، ثم التسمية، ثم غسل الكفين ثلاثاً، ثم المضمضة والاستنشاق ثلاثاً، ثم غسل الوجه ثلاثاً، ثم غسل اليدين إلى المرفقين ثلاثاً (بدءاً باليمنى)، ثم مسح الرأس والأذنين مرة واحدة، ثم غسل الرجلين إلى الكعبين ثلاثاً.";
      } else if (lower.includes("صلاة") || lower.includes("ركعات")) {
        fallback = "الصلوات المفروضة خمس في اليوم والليلة: الفجر (ركعتان جهرية)، الظهر (أربع ركعات سرية)، العصر (أربع ركعات سرية)، المغرب (ثلاث ركعات: ركعتان جهراً وواحدة سراً)، العشاء (أربع ركعات: ركعتان جهراً وركعتان سراً).";
      } else if (lower.includes("استغفار") || lower.includes("توبة")) {
        fallback = "من صيغ الاستغفار العظيمة: «سيد الاستغفار: اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ...»، وقَالَ النبي ﷺ: «مَنْ لَزِمَ الِاسْتِغْفَارَ جَعَلَ اللَّهُ لَهُ مِنْ كُلِّ ضِيقٍ مَخْرَجًا، وَمِنْ كُلِّ هَمٍّ فَرَجًا».";
      } else if (lower.includes("فضل") || lower.includes("تسبيح")) {
        fallback = "قال رسول الله ﷺ: «كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ» (متفق عليه).";
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
              text: `أنت المساعد الشرعي الذكي لتطبيق 'نور الإسلام'.
أجب السائل بأسلوب إسلامي مؤدب، علمي، وموثوق، مستشهداً بآيات القرآن الكريم والأحاديث النبوية الصحيحة إن أمكن، مع إيجاز مريح للقراءة على شاشات الجوال:

السؤال: ${prompt}`
            }
          ]
        }
      ]
    });

    res.json({ reply: response.text || "وفقك الله لكل خير وبورك فيك." });
  } catch (error: any) {
    console.error("AI Error:", error);
    res.status(500).json({ 
      reply: "حدث خطأ غير متوقع أثناء معالجة السؤال. يمكنك المحاولة مرة أخرى أو البحث في تبويب الأحاديث والقرآن." 
    });
  }
});

// 2. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Noor Al-Islam" });
});

// 3. Export Project as ZIP Endpoint
function addDirectoryToZip(zip: JSZip, rootDir: string, currentDir: string = "") {
  const fullCurrentDir = currentDir ? path.join(rootDir, currentDir) : rootDir;
  if (!fs.existsSync(fullCurrentDir)) return;
  
  const items = fs.readdirSync(fullCurrentDir);
  for (const item of items) {
    if (
      item === "node_modules" ||
      item === ".git" ||
      item === "dist" ||
      item === ".env" ||
      item === "bun.lock"
    ) {
      continue;
    }
    const relativeItemPath = currentDir ? path.join(currentDir, item) : item;
    const fullPath = path.join(rootDir, relativeItemPath);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      addDirectoryToZip(zip, rootDir, relativeItemPath);
    } else {
      const content = fs.readFileSync(fullPath);
      zip.file(relativeItemPath.replace(/\\/g, "/"), content);
    }
  }
}

app.get("/api/export-zip", async (req, res) => {
  try {
    const zip = new JSZip();
    const projectRoot = process.cwd();
    addDirectoryToZip(zip, projectRoot, "");
    
    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
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
  } catch (error: any) {
    console.error("ZIP generation error:", error);
    res.status(500).json({ error: "Failed to generate ZIP archive" });
  }
});

// 4. Vite Middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`نور الإسلام Server running on http://localhost:${PORT}`);
  });
}

startServer();
