/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client to prevent crashes if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined in the environment. Please add it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Simple healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", time: new Date().toISOString() });
});

// 1. AI Smart Size Assistant API
app.post("/api/smart-size", async (req, res) => {
  const { height, weight, age, gender, bodyType } = req.body;

  if (!height || !weight || !age || !gender) {
    return res.status(400).json({ error: "الرجاء إدخال الطول، الوزن، العمر، والجنس لتقدير المقاس." });
  }

  try {
    const ai = getGeminiAI();
    
    const prompt = `
      You are an expert master tailor (خياط رئيسي ممتاز) for the premium Arabic fashion platform "Yazan" (منصة يزن للأزياء والتفصيل).
      Based on the following physical profile, calculate/estimate the perfect sewing measurements (مقاسات التفصيل) in centimeters (سم).
      
      User Profile:
      - Gender: ${gender === "female" ? "أنثى (Female)" : "ذكر (Male)"}
      - Height: ${height} cm
      - Weight: ${weight} kg
      - Age: ${age} years old
      - Body Type: ${bodyType || "عادي (Regular)"}
      
      Generate logical, professional sewing measurements for a custom outfit (like a Thobe for men or Abaya/Dress for women).
      Respond strictly in JSON format with the following keys based on gender:
      
      Common fields:
      - height (number, same as provided)
      - shoulder (number, shoulder-to-shoulder width)
      - chest (number, full chest circumference)
      - waist (number, waist circumference)
      - sleeveLength (number, sleeve length from shoulder to wrist)
      
      Female fields (only if gender is "female"):
      - hips (number, hips circumference)
      - neckline (number, neckline width/depth, usually 14-20 cm)
      
      Male fields (only if gender is "male"):
      - neck (number, collar/neck circumference, usually 36-46 cm)
      - armLength (number, arm length, usually slightly more than sleeve length)

      Include a "confidenceScore" (number between 0 and 100) and a brief "tailorNote" (string in Arabic) explaining why these measurements are selected based on the body shape and how they will fit elegantly.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            height: { type: Type.INTEGER },
            shoulder: { type: Type.INTEGER },
            chest: { type: Type.INTEGER },
            waist: { type: Type.INTEGER },
            sleeveLength: { type: Type.INTEGER },
            hips: { type: Type.INTEGER, description: "Only for female" },
            neckline: { type: Type.INTEGER, description: "Only for female" },
            neck: { type: Type.INTEGER, description: "Only for male" },
            armLength: { type: Type.INTEGER, description: "Only for male" },
            confidenceScore: { type: Type.INTEGER },
            tailorNote: { type: Type.STRING },
          },
          required: ["height", "shoulder", "chest", "waist", "sleeveLength", "confidenceScore", "tailorNote"],
        },
      },
    });

    const resultText = response.text?.trim() || "{}";
    const resultObj = JSON.parse(resultText);

    res.json({ success: true, measurements: resultObj });
  } catch (error: any) {
    console.error("Gemini Sizing Error:", error);
    // Provide a professional tailor fallback if Gemini key is missing or fails
    const defaultSizing: any = {
      height: Number(height),
      shoulder: gender === "female" ? Math.round(Number(height) * 0.24) : Math.round(Number(height) * 0.26),
      chest: Math.round(Number(weight) * 1.2) + 12,
      waist: Math.round(Number(weight) * 1.1) + 8,
      sleeveLength: Math.round(Number(height) * 0.35),
      confidenceScore: 75,
      tailorNote: "تم حساب هذه المقاسات بناءً على المعدلات القياسية لجسمك. يمكنك تعديلها يدوياً لضمان الدقة الكاملة.",
    };

    if (gender === "female") {
      defaultSizing.hips = Math.round(Number(weight) * 1.3) + 15;
      defaultSizing.neckline = 16;
    } else {
      defaultSizing.neck = Math.round(Number(weight) * 0.15) + 28;
      defaultSizing.armLength = Math.round(Number(height) * 0.38);
    }

    res.json({
      success: true,
      measurements: defaultSizing,
      isFallback: true,
      errorMessage: error.message,
    });
  }
});

// 2. AI Smart Shopping Assistant API
app.post("/api/smart-shopping", async (req, res) => {
  const { message, history, catalogProducts } = req.body;

  if (!message) {
    return res.status(400).json({ error: "الرجاء كتابة رسالة للتحدث مع مساعد يزن الذكي." });
  }

  try {
    const ai = getGeminiAI();

    // Prepare a concise description of current catalog items to grounding Gemini
    const catalogSummary = (catalogProducts || []).map((p: any) => (
      `- ID: ${p.id}, الاسم: ${p.name}, السعر: ${p.price} ريال, القسم: ${p.category} (${p.subCategory}), الخصائص: ${p.isCustomizable ? "قابل للتفصيل والتخصيص" : "جاهز فقط"}`
    )).join("\n");

    const prompt = `
      You are the Elite Smart Personal Stylist & Shopping Assistant (مستشار الأناقة ومساعد التسوق الذكي) named "Yazan Assistant" (مساعد يزن الذكي) for the luxury boutique platform "Yazan".
      Your goals:
      - Answer questions gracefully in elegant, luxury, warm Arabic.
      - Guide the user on styling choices, matching fabrics, and standard fits.
      - Explicitly suggest and recommend products from the Yazan catalog that best match their description.
      - Suggest whether they should buy ready-made or configure a custom tailored outfit.
      
      Yazan Catalog Products Available:
      ${catalogSummary}

      Conversation History:
      ${JSON.stringify(history || [])}

      Current User Message:
      "${message}"

      Task:
      Respond with a JSON object containing:
      1. "responseText" (string): The elegant Arabic response with styling advice, welcoming tone, and summaries of recommendations. Use beautiful markdown but keep it structured.
      2. "recommendedProductIds" (array of strings): The list of product IDs from our catalog that match the query (empty if no direct matches).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            responseText: { type: Type.STRING },
            recommendedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["responseText", "recommendedProductIds"],
        },
      },
    });

    const resultText = response.text?.trim() || "{}";
    const resultObj = JSON.parse(resultText);

    res.json({ success: true, ...resultObj });
  } catch (error: any) {
    console.error("Gemini Shopping Assistant Error:", error);
    // Sophisticated fallback matching logic
    let responseText = "مرحباً بك في يزن للأزياء الفاخرة. أنا مستشارك للأناقة والجمال. يسعدني مساعدتك في اختيار الأزياء والتفصيل الفاخر. ";
    let recommendedProductIds: string[] = [];

    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes("عباية") || lowerMsg.includes("نسائي") || lowerMsg.includes("فستان")) {
      responseText += "بناءً على طلبك، لدينا تشكيلة فاخرة من الأزياء النسائية والعبايات المخملية وفساتين السهرة الحريرية المصنوعة يدوياً خصيصاً لك. نوصي بتجربة 'عباية مخملية سوداء مطرزة بالذهب' أو 'فستان السهرة الحريري الإمبراطوري'.";
      recommendedProductIds = ["prod-1", "prod-2"];
    } else if (lowerMsg.includes("ثوب") || lowerMsg.includes("رجالي") || lowerMsg.includes("بدلة") || lowerMsg.includes("قميص")) {
      responseText += "طلبك يجسد الفخامة والوجاهة. تشكيلتنا الرجالية تضم 'ثوب يزن الفاخر' المخيط من خامة السلك الياباني الأصلي، بالإضافة إلى 'بدلة كشمير إيطالية زرقاء ملكية'. يسعدنا أخذ مقاساتك لتفصيلها لك.";
      recommendedProductIds = ["prod-3", "prod-4"];
    } else if (lowerMsg.includes("حذاء") || lowerMsg.includes("صندل") || lowerMsg.includes("جزمة")) {
      responseText += "الأناقة الحقيقية تبدأ من التفاصيل. نوفر لك 'صندل يزن الشرقي المطرز يدوياً بالجلد الإيطالي' و 'حذاء أكسفورد كلاسيكي' الأنيق لتكتمل هيبتك.";
      recommendedProductIds = ["prod-5", "prod-6"];
    } else if (lowerMsg.includes("عطر") || lowerMsg.includes("حقيبة") || lowerMsg.includes("إكسسوار")) {
      responseText += "لتكتمل فخامتك، نقترح عليك تجربة 'عطر يزن الملكي' بنفحات دهن العود العتيق والورد الطائفي الفاخر، أو اقتناء 'حقيبة اليد الأنيقة بنقشة التمساح' الفاخرة.";
      recommendedProductIds = ["prod-7", "prod-8"];
    } else {
      responseText += "يسرني ترشيح تشكيلة 'يزن' الأفضل مبيعاً التي تضمن لك إطلالة ملكية ساحرة في كافة المحافل، سواءً الجاهزة منها أو المفصلة خصيصاً على هيبتك.";
      recommendedProductIds = ["prod-1", "prod-3", "prod-8"];
    }

    res.json({
      success: true,
      responseText: responseText + "\n\n(ملاحظة: يعمل هذا الرد بنمط الأناقة الاحتياطي، يمكنك إدخال مفتاح Gemini للاستمتاع بالمحادثة الكاملة بالذكاء الاصطناعي.)",
      recommendedProductIds,
      isFallback: true,
    });
  }
});

// Setup Vite & Static Assets serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development server with Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static files serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    // Fallback in case of express 4 compatibility
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Yazan Server] Full-stack application online on http://localhost:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start Yazan Server:", err);
});
