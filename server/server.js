require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Tesseract = require("tesseract.js");
const pdfPoppler = require("pdf-poppler");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const upload = multer({ dest: "uploads/" });
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* ---------------- FALLBACK PARSER ---------------- */
function fallbackProfile(text) {
  return {
    full_name: "",
    email:
      text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/)?.[0] || "",
    phone_number:
      text.match(/(\+91[\s-]?)?\d{10}/)?.[0] || "",
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    achievements: [],
    areas_of_interest: []
  };
}

/* ---------------- GEMINI SETUP (FLASH 2.5) ---------------- */
if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "models/gemini-2.5-flash"
});

console.log("✅ Using models/gemini-2.5-flash");

/* ---------------- OCR FOR SCANNED PDF ---------------- */
async function extractTextFromScannedPDF(filePath) {
  const tempDir = path.join(__dirname, "temp_ocr");
  const imageDir = path.join(tempDir, "images");

  fs.mkdirSync(imageDir, { recursive: true });

  await pdfPoppler.convert(filePath, {
    format: "png",
    out_dir: imageDir,
    page: null
  });

  let fullText = "";

  for (const img of fs.readdirSync(imageDir)) {
    if (img.endsWith(".png")) {
      const result = await Tesseract.recognize(
        path.join(imageDir, img),
        "eng"
      );
      fullText += result.data.text + "\n";
    }
  }

  fs.rmSync(tempDir, { recursive: true, force: true });
  return fullText;
}

/* ---------------- GEMINI PARSER ---------------- */
async function extractProfileWithGemini(resumeText) {
  if (!resumeText || resumeText.trim().length < 100) {
    throw new Error("Resume text too short");
  }

  const prompt = `
You are a resume parsing engine.

Return ONLY valid JSON.
No markdown.
No explanation.

Schema:
{
  "full_name": "",
  "email": "",
  "phone_number": "",
  "skills": [],
  "education": [],
  "experience": [],
  "projects": [],
  "certifications": [],
  "achievements": [],
  "areas_of_interest": []
}

Rules:
- All keys must exist
- Empty string or array if missing
- Do not guess

Resume:
"""
${resumeText.slice(0, 12000)}
"""
`;

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  });

  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Gemini did not return JSON");
  }

  return JSON.parse(jsonMatch[0]);
}

/* ---------------- TEST ROUTE ---------------- */
app.get("/test-gemini", async (req, res) => {
  try {
    const r = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: "Reply with only the word OK" }]
        }
      ]
    });

    res.send(r.response.text());
  } catch (err) {
    console.error("Gemini test failed:", err.message);
    res.status(500).send(err.message);
  }
});

/* ---------------- API ---------------- */
app.post("/api/resume/parse", upload.single("resume"), async (req, res) => {
  try {
    let resumeText = "";
    const filePath = req.file.path;
    const fileName = req.file.originalname.toLowerCase();

    if (fileName.endsWith(".pdf")) {
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      resumeText = data.text || "";

      if (resumeText.length < 50) {
        console.log("⚠ Scanned PDF detected, using OCR");
        resumeText = await extractTextFromScannedPDF(filePath);
      }
    } else {
      resumeText = (await mammoth.extractRawText({ path: filePath })).value;
    }

    fs.unlinkSync(filePath);

    let profile;
    try {
      profile = await extractProfileWithGemini(resumeText);
    } catch (err) {
      console.error("⚠ Gemini failed, fallback used:", err.message);
      profile = fallbackProfile(resumeText);
    }

    res.json({ success: true, profile });
  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ---------------- START SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
