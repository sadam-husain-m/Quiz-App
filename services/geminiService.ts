
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

export interface FileData {
  mimeType: string;
  data: string;
}

export const generateQuizQuestions = async (
  topic: string, 
  round: number, 
  count: number, 
  type: 'text' | 'visual' | 'scientist_clues' | 'direct_block',
  fileData?: FileData
): Promise<Question[]> => {
  // Always use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let systemInstruction = '';
  
  if (type === 'text') {
    systemInstruction = `Generate ${count} multiple-choice questions for Round ${round} about "${topic}". Each question MUST have exactly 4 options and one correct answer index (0-3).`;
  } else if (type === 'visual') {
    systemInstruction = `Generate ${count} visual identification questions for Round ${round} about "${topic}". Provide a detailed "imagePrompt" for a scientific diagram.`;
  } else if (type === 'scientist_clues') {
    systemInstruction = `Generate ${count} "Identify the Scientist" questions for Round ${round}. Provide exactly 4 distinct "cluePrompts" for image generation. Each question should have 4 options for the name.`;
  } else if (type === 'direct_block') {
    systemInstruction = `Generate ${count} short, direct-answer physics questions about "${topic}" for a rapid-fire round. DO NOT provide options. Provide the correct answer in the 'explanation' field. Keep questions very concise.`;
  }

  if (fileData) {
    systemInstruction += ` USE THE ATTACHED DOCUMENT AS THE PRIMARY SOURCE.`;
  }

  const properties: any = {
    id: { type: Type.STRING },
    text: { type: Type.STRING },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    correctIndex: { type: Type.INTEGER },
    explanation: { type: Type.STRING }
  };

  if (type === 'visual') {
    properties.imagePrompt = { type: Type.STRING };
  } else if (type === 'scientist_clues') {
    properties.cluePrompts = { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }
    };
  }

  const contents: any = {
    parts: [{ text: systemInstruction }]
  };

  if (fileData) {
    contents.parts.unshift({
      inlineData: {
        mimeType: fileData.mimeType,
        data: fileData.data
      }
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties,
          required: ["id", "text", "explanation", ...(type === 'direct_block' ? [] : ["options", "correctIndex"])]
        }
      }
    }
  });

  try {
    const jsonStr = response.text.trim();
    const rawQuestions = JSON.parse(jsonStr);
    return rawQuestions.map((q: any) => ({
      ...q,
      round,
      type,
      options: q.options || [],
      correctIndex: q.correctIndex || 0
    }));
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error(`Could not generate questions for Round ${round}.`);
  }
};

export const generateImageForQuestion = async (prompt: string): Promise<string> => {
  // Always use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A clean, professional scientific illustration of: ${prompt}. Educational style, no text.` }]
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to generate image");
};
