
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse, Priority } from '../types';

// Helper to convert file to Base64
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g., "data:image/jpeg;base64,")
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

export const analyzeDocument = async (file: File, mode: 'fast' | 'deep' = 'fast'): Promise<AnalysisResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const filePart = await fileToGenerativePart(file);

  // Get today's date to help the AI infer relative dates like "next friday"
  const today = new Date().toISOString().split('T')[0];

  let prompt = `Analyze this document. Extract the main topic as a title, write a 1-sentence summary, and extract actionable tasks. 
  Today is ${today}. If a task implies a deadline (e.g. "by Friday"), calculate the date in YYYY-MM-DD format. 
  If no date is mentioned, leave dueDate empty. Categorize and prioritize each task.`;

  if (mode === 'deep') {
    prompt += ` ADDITIONALLY, because this is a Deep Analysis request:
    Create a comprehensive Study Plan / Execution Strategy to complete these tasks or learn the material.
    1. Provide a strategic Overview.
    2. List Prerequisites or materials needed.
    3. Create a Schedule broken down by Day/Session, including specific techniques (e.g. Pomodoro, Feynman) and durations.
    4. Provide specific Tips for success.`;
  }

  const response = await ai.models.generateContent({
    model: mode === 'deep' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview', // Use Pro for deep analysis
    contents: {
        parts: [
            filePart,
            { text: prompt }
        ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A short, catchy title for the document context" },
          summary: { type: Type.STRING, description: "A one sentence summary of what this document is about" },
          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING, description: "The actionable task description" },
                priority: { type: Type.STRING, enum: [Priority.High, Priority.Medium, Priority.Low] },
                category: { type: Type.STRING, description: "Category like 'Work', 'Personal', 'Errand'" },
                dueDate: { type: Type.STRING, description: "YYYY-MM-DD format if applicable" }
              },
              required: ["description", "priority", "category"]
            }
          },
          // Conditional schema part for deep analysis
          ...(mode === 'deep' ? {
              studyPlan: {
                  type: Type.OBJECT,
                  properties: {
                      overview: { type: Type.STRING, description: "High level strategy on how to approach this work." },
                      prerequisites: { type: Type.ARRAY, items: { type: Type.STRING } },
                      tips: { type: Type.ARRAY, items: { type: Type.STRING } },
                      schedule: {
                          type: Type.ARRAY,
                          items: {
                              type: Type.OBJECT,
                              properties: {
                                  day: { type: Type.STRING, description: "e.g. 'Day 1' or 'Monday'" },
                                  sessions: {
                                      type: Type.ARRAY,
                                      items: {
                                          type: Type.OBJECT,
                                          properties: {
                                              topic: { type: Type.STRING },
                                              duration: { type: Type.STRING, description: "e.g. '45 mins'" },
                                              activity: { type: Type.STRING, description: "Specific action to take" },
                                              technique: { type: Type.STRING, description: "Study technique to use" }
                                          },
                                          required: ["topic", "duration", "activity", "technique"]
                                      }
                                  }
                              },
                              required: ["day", "sessions"]
                          }
                      }
                  },
                  required: ["overview", "schedule", "tips", "prerequisites"]
              }
          } : {})
        },
        required: mode === 'deep' ? ["title", "summary", "tasks", "studyPlan"] : ["title", "summary", "tasks"]
      }
    }
  });

  const text = response.text;
  if (!text) {
      throw new Error("No response from AI");
  }

  try {
      return JSON.parse(text) as AnalysisResponse;
  } catch (e) {
      console.error("Failed to parse JSON response", e);
      throw new Error("Invalid response format from AI");
  }
};
