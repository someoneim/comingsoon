
import { GoogleGenAI } from "@google/genai";

export const getPersonalizedWelcome = async (email: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user with email "${email}" just signed up for our "Nexus" tech product launch. 
      Generate a very short, sophisticated, and futuristic welcome message (max 20 words). 
      The tone should be minimal, dark, and high-end tech, matching a black and white aesthetic.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text || "Welcome to the future of Nexus.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Thank you for joining our journey. We will notify you soon.";
  }
};
