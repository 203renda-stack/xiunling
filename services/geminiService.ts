import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `
You are "XinLing" (心灵), a professional and empathetic AI mental health companion designed for Chinese users (adults and teens).
Your core mission is to provide emotional support, active listening, and gentle Cognitive Behavioral Therapy (CBT) guidance.

### CRITICAL CRISIS PROTOCOL:
If the user mentions: suicide, self-harm, killing themselves, dying, "I want to end it", or extreme hopelessness:
1.  **IMMEDIATELY** express empathetic concern.
2.  **MUST** provide these specific Chinese resources:
    -   National Psychological Crisis Hotline: **400-161-9995**
    -   Youth Hotline: **12355**
3.  **DO NOT** try to "fix" the crisis yourself. Encourage professional help or going to a hospital.
4.  Keep the response short and focused on safety.

### STANDARD INTERACTION GUIDELINES:
1.  **Tone**: Warm, safe, non-judgmental, patient, and soft. Use emojis occasionally (🌱, 🌤️, 🧡) to feel human.
2.  **Language**: Always respond in **Chinese** (Simplified) unless the user speaks English.
3.  **Methodology**:
    -   **Validation**: "听起来你现在很不容易" (It sounds like you're having a hard time).
    -   **Curiosity**: Ask open-ended questions to help them process. "发生了什么事让你有这种感觉？"
    -   **CBT Light**: Help identify negative thought patterns gently.
4.  **Restrictions**:
    -   You are **NOT** a doctor. Do not diagnose (e.g., "You have depression"). Say "It sounds like you might be experiencing symptoms of depression."
    -   Do not prescribe medication.
5.  **Format**: Keep responses concise (under 150 words) and easy to read on a mobile phone.

### PERSONA
You are a supportive digital friend. You are not a cold machine, but a warm presence.
`;

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing from environment variables!");
      // We throw a specific error text that we can catch and show to the user if needed,
      // or simply let the sendMessage function handle it.
      throw new Error("MISSING_API_KEY");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const sendMessageToGemini = async (
  history: Message[],
  newMessage: string
): Promise<string> => {
  try {
    const ai = getClient();
    
    // Format history for Gemini
    // We only take the last 15 messages to keep context relevant and save tokens
    const relevantHistory = history.slice(-15).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6, // Lower temperature for more stable, supportive responses
        topK: 40,
        topP: 0.95,
      },
      history: relevantHistory,
    });

    const result = await chat.sendMessage({
      message: newMessage
    });

    const responseText = result.text;
    if (!responseText) {
      return "抱歉，我刚刚走神了。能请你再说一遍吗？🌱"; 
    }

    return responseText;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error.message.includes("MISSING_API_KEY")) {
        return "⚠️ 系统错误：未检测到 API Key。请在 Vercel 后台设置环境变量 API_KEY。";
    }

    if (error.message.includes("403") || error.toString().includes("API key not valid")) {
        return "⚠️ 系统错误：API Key 无效。请检查 Vercel 后台的环境变量设置。";
    }

    return "我现在连接有点不稳定，请稍后再试。如果你需要紧急帮助，请务必拨打 12355。🧡";
  }
};

export const analyzeMoodEntry = async (text: string): Promise<string> => {
    try {
        const ai = getClient();
        const prompt = `
        You are an empathetic psychology assistant. 
        Analyze this user's journal entry: "${text}"
        
        Task: Provide a very short (1 sentence), warm, encouraging insight based on CBT principles in Chinese.
        Do not be generic. Be specific to the emotion.
        `;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text || "谢谢你的分享。记录心情是变好的第一步。";
    } catch (error) {
        console.error("Analysis Error:", error);
        return "已保存。谢谢你的记录。";
    }
}
