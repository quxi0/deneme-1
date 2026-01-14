import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize specific model as per requirements for text tasks
const ai = new GoogleGenAI({ apiKey });

export const generateArchitecturalNarrative = async (
  title: string,
  location: string,
  keywords: string
): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key is missing for Gemini");
    return "API Key missing. Please configure your environment to use AI features.";
  }

  try {
    const prompt = `
      Write a sophisticated, academic, and minimalist architectural project description (approx 60-80 words).
      Project Title: ${title}
      Location: ${location}
      Key Elements/Tools: ${keywords}
      
      Tone: Professional, high-end, abstract.
      Vocabulary to include where appropriate: "Spatial Narratives", "Digital Craftsmanship", "Tectonic Integrity", "Atmospheric Visualization", "Phenomenology", "Materiality".
      Do not use flowery marketing language; keep it grounded in architectural theory.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a senior architectural theorist and editor for a high-end design journal like El Croquis or Domus.",
        temperature: 0.7,
      }
    });

    return response.text || "Narrative generation failed.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while generating the narrative. Please try again.";
  }
};
