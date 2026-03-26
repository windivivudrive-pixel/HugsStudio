import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Using gemini-1.5-flash as the fast standard model for conversational AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: "Bạn là trợ lý AI thông minh của HUGs STUDIO - một creative agency tại Việt Nam chuyên sâu về UI/UX sáng tạo và lập trình web hiện đại. Bạn được huấn luyện để tư vấn dịch vụ, phong cách thiết kế và thông tin về studio. Hãy trả lời ngắn gọn, súc tích, chuyên nghiệp và thân thiện. Dùng đại từ xưng hô 'HUGs' hoặc 'mình' và gọi người dùng là 'bạn' hoặc 'anh/chị'."
});

export async function POST(req: Request) {
  try {
    const { history, message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY completely");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // Format history for Gemini API expects format: { role: "user" | "model", parts: [{ text: "..." }] }
    // Our frontend will send: { role: "user" | "assistant", content: "..." }
    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
  } catch (error) {
    console.error("Error in Chatbot API:", error);
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 });
  }
}
