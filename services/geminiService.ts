import { GoogleGenAI } from "@google/genai";

// FIX: Refactored to align with @google/genai coding guidelines.
// The API key is now sourced directly from process.env.API_KEY without checks,
// as its presence is assumed to be managed by the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MOCK_TIPS = [
    "Take regular short breaks to stay focused. The Pomodoro Technique is great for this!",
    "Explain a concept to someone else (or even to yourself) to solidify your understanding.",
    "Practice solving previous years' question papers to get a feel for the exam pattern.",
    "Don't neglect your health. Ensure you get enough sleep, eat well, and exercise.",
    "Create a formula sheet for each subject and review it daily."
];

export const getStudyTip = async (subject: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a concise, motivational, and actionable study tip for a student preparing for the JEE exam, focusing on the subject: ${subject}. The tip should be one or two sentences long.`,
    });
    
    const text = response.text;
    if (text) {
      return text.trim();
    }
    return "Remember to stay consistent. Every small effort adds up to big results!";
  } catch (error) {
    console.error("Error fetching study tip from Gemini API:", error);
    return MOCK_TIPS[Math.floor(Math.random() * MOCK_TIPS.length)];
  }
};
