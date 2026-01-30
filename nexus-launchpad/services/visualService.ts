
import { GoogleGenAI } from "@google/genai";

/**
 * Generates a high-quality, thematic image for a specific feature using the Gemini 2.5 Flash Image model.
 * The prompt is tailored to ensure the output matches the "Nexus" dark, minimalist, and high-tech aesthetic.
 */
export const generateFeatureVisual = async (featureTitle: string, featureDetails: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Create a highly sophisticated, minimalist tech visual for "${featureTitle}".
    Subject: ${featureDetails}
    Style: Monochrome, dark background, deep blacks, subtle glowing white lines, blueprint or architectural schematic feel, 
    ultra-high-end tech interface, cinematic lighting, 16:9 cinematic aspect ratio. 
    No text in the image. Pure visual metaphor.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    // Iterate through candidates and parts to find the image data
    for (const candidate of response.candidates || []) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};
