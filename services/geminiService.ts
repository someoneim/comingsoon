
import { GoogleGenAI } from "@google/genai";

export const getPersonalizedWelcome = async (email: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  const isMock = !apiKey || apiKey === 'PLACEHOLDER_API_KEY';

  if (isMock) {
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));
    return "Protocol initiated. Welcome to Automy.";
  }

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp', // Updated to latest model
      contents: `The user with email "${email}" just signed up for our "Automy" tech product launch. 
      Generate a very short, sophisticated, and futuristic welcome message (max 20 words). 
      The tone should be minimal, dark, and high-end tech, matching a black and white aesthetic.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text || "Welcome to the future of Automy.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Thank you for joining our journey. We will notify you soon.";
  }
};
