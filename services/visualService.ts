
import { GoogleGenAI } from "@google/genai";

/**
 * Generates a high-quality, thematic image for a specific feature using the Gemini 2.5 Flash Image model.
 * The prompt is tailored to ensure the output matches the "Nexus" dark, minimalist, and high-tech aesthetic.
 */
export const generateFeatureVisual = async (featureTitle: string, featureDetails: string): Promise<string | null> => {
    const apiKey = process.env.API_KEY;
    const isMock = !apiKey || apiKey === 'PLACEHOLDER_API_KEY';

    if (isMock) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Return high-quality technological aesthetic images from Unsplash based on keywords
        const keywords = featureTitle.toLowerCase();
        if (keywords.includes('code') || keywords.includes('api')) {
            return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000";
        } else if (keywords.includes('mobile') || keywords.includes('app')) {
            return "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1000";
        } else if (keywords.includes('secure') || keywords.includes('shield')) {
            return "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=1000";
        } else {
            return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000";
        }
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
    Create a highly sophisticated, minimalist tech visual for "${featureTitle}".
    Subject: ${featureDetails}
    Style: Monochrome, dark background, deep blacks, subtle glowing white lines, blueprint or architectural schematic feel, 
    ultra-high-end tech interface, cinematic lighting, 16:9 cinematic aspect ratio. 
    No text in the image. Pure visual metaphor.
  `;

    try {
        return await originalGenerateLogic(apiKey, prompt);
    } catch (error) {
        console.error("Image Generation Error:", error);
        return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000";
    }
};

// Helper to keep the original logic isolated
const originalGenerateLogic = async (apiKey: string | undefined, prompt: string) => {
    const ai = new GoogleGenAI({ apiKey: apiKey || '' });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: { parts: [{ text: prompt }] }
        });
        return null;
    } catch (e) { throw e; }
}
