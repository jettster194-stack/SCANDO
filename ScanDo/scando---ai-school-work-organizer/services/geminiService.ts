
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse, Priority } from '../types';

/**
 * Helper to convert file to Base64 for Gemini API input
 */
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Analyzes an uploaded document (image or PDF) using Gemini.
 */
export const analyzeDocument = async (file: File, mode: 'fast' | 'deep' = 'fast'): Promise<AnalysisResponse> => {
  // Retrieve the API Key injected in index.html
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error("CRITICAL ERROR: API_KEY is missing. Ensure it is defined in index.html or environment variables.");
    throw new Error("Service Configuration Error. Please contact the developer.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const filePart = await fileToGenerativePart(file);
  const today = new Date().toISOString().split('T')[0];

  const systemInstruction = `You are an elite productivity strategist. 
  Extract every actionable task from the document.
  - Title: Catchy and descriptive.
  - Tasks: Clear, concise, and prioritized.
  - Dates: Map relative dates (like "tomorrow") to YYYY-MM-DD based on today (${today}).`;

  let userPrompt = `Analyze the attached document and return a structured JSON task list. Today is ${today}.`;

  if (mode === 'deep') {
    userPrompt += ` 
    CRITICAL: This is a DEEP ANALYSIS request. Use your advanced reasoning to:
    1. Provide a strategic OVERVIEW of the content.
    2. List all PREREQUISITES or materials needed to succeed.
    3. Create a 7-day STUDY_PLAN with daily sessions, durations, and specific techniques (e.g. Feynman, Pomodoro).
    4. List 3 high-impact EXECUTION_TIPS.`;
  }

  try {
      const response = await ai.models.generateContent({
        model: mode === 'deep' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview',
        contents: {
            parts: [
                filePart,
                { text: userPrompt }
            ]
        },
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          thinkingConfig: mode === 'deep' ? { thinkingBudget: 4000 } : undefined,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              tasks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    description: { type: Type.STRING },
                    priority: { type: Type.STRING, enum: [Priority.High, Priority.Medium, Priority.Low] },
                    category: { type: Type.STRING },
                    dueDate: { type: Type.STRING }
                  },
                  required: ["description", "priority", "category"]
                }
              },
              studyPlan: {
                type: Type.OBJECT,
                properties: {
                  overview: { type: Type.STRING },
                  prerequisites: { type: Type.ARRAY, items: { type: Type.STRING } },
                  tips: { type: Type.ARRAY, items: { type: Type.STRING } },
                  schedule: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        day: { type: Type.STRING },
                        sessions: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              topic: { type: Type.STRING },
                              duration: { type: Type.STRING },
                              activity: { type: Type.STRING },
                              technique: { type: Type.STRING }
                            },
                            required: ["topic", "duration", "activity", "technique"]
                          }
                        }
                      },
                      required: ["day", "sessions"]
                    }
                  }
                }
              }
            },
            required: ["title", "summary", "tasks"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("AI extraction returned empty result.");

      return JSON.parse(text) as AnalysisResponse;

  } catch (e: any) {
      console.error("Gemini API Error:", e);
      
      const msg = e.toString().toLowerCase();

      // Check for common API Key Restriction errors
      if (msg.includes('403') || msg.includes('permission denied') || msg.includes('key not valid')) {
         throw new Error("Access Denied: Domain not allowed. Check API Key restrictions in Google Cloud Console.");
      }
      
      if (msg.includes('400') || msg.includes('invalid argument')) {
          throw new Error("Bad Request: The file format might not be supported or the image is corrupt.");
      }

      throw new Error("Analysis failed. Please try a clearer image or PDF.");
  }
};
