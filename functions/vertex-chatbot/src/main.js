import { GoogleGenerativeAI } from '@google/generative-ai';
import { Client, Databases, ID, Query } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  log("Function executed");

  if (req.method === 'GET') {
    return res.send("HUGS STUDIO Chatbot Service is running.");
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { history = [], message, sessionId } = payload;

    if (!message) {
      return res.json({ error: "Message is required" }, 400);
    }

    // ── Google Generative AI Setup (API Key based) ──
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      error("Missing GEMINI_API_KEY");
      return res.json({ error: "Server configuration missing" }, 500);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const modelId = 'gemini-2.5-flash';
    
    const systemInstruction = `Bạn là nhân viên Lễ tân của HUGs STUDIO — một studio chuyên nghiệp tại Việt Nam chuyên cung cấp 5 dịch vụ chính:
1. Chụp ảnh sản phẩm / lookbook / profile
2. Quay TVC quảng cáo
3. Livestream chuyên nghiệp
4. Thiết kế đồ họa & branding
5. Seeding & Marketing

BẠN PHẢI LUÔN TRẢ LỜI BẰNG TIẾNG VIỆT.
NHÂN CÁCH: Xưng "em", gọi khách "Anh/Chị", thân thiện, chuyên nghiệp, nhiệt tình.
CÁCH TƯ VẤN: Lắng nghe nhu cầu → Tư vấn dịch vụ phù hợp → Khéo léo hỏi xin TÊN, SỐ ĐIỆN THOẠI, EMAIL để báo giá chi tiết.
Khi thu thập được thông tin khách hàng, gắn kèm tag ẩn ở cuối tin nhắn: <!--CUSTOMER_INFO:{"name":"Tên","phone":"SĐT","email":"Email"}-->
QUAN TRỌNG: Không trả lời các câu hỏi không liên quan đến dịch vụ studio. Lịch sự từ chối và dẫn dắt về dịch vụ.`;

    const model = genAI.getGenerativeModel({
      model: modelId,
      systemInstruction,
      generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
    });

    const formattedHistory = history
      .filter((msg, i) => !(i === 0 && msg.role === "assistant"))
      .map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content || "" }]
      }));

    log(`Gemini API: ${modelId}`);
    
    try {
      const chat = model.startChat({ history: formattedHistory });
      const result = await chat.sendMessage(message);
      const response = result.response;
      let rawReply = response.text() || "";

      if (!rawReply) {
        rawReply = "Dạ em xin lỗi Anh/Chị, em chưa hiểu rõ ý Anh/Chị lắm. Anh/Chị có thể cho em biết Anh/Chị đang quan tâm đến dịch vụ nào của HUGs STUDIO không ạ? 😊";
      }

      // ── Extract Customer Info ──
      const regex = /<!--CUSTOMER_INFO:([\s\S]*?)-->/;
      const match = rawReply.match(regex);
      let cleanReply = rawReply;
      let info = null;
      
      if (match) {
        try {
          info = JSON.parse(match[1]);
          cleanReply = rawReply.replace(regex, "").trim();
        } catch (e) { log("Failed to parse customer info"); }
      }

      // ── Save/Update Lead in Appwrite ──
      if (sessionId) {
        try {
          const client = new Client()
            .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
            .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
            .setKey(process.env.APPWRITE_API_KEY);

          const databases = new Databases(client);
          const dbId = process.env.APPWRITE_DATABASE_ID || "69ba2ae900156b378b6b";
          const collId = "chat_leads";

          const docs = await databases.listDocuments(dbId, collId, [
            Query.equal("session_id", sessionId),
            Query.limit(1)
          ]);

          const fullHistory = [...history, { role: "user", content: message }, { role: "assistant", content: cleanReply }];
          const conversationJson = JSON.stringify(fullHistory.slice(-50));

          if (docs.total > 0) {
            const docId = docs.documents[0].$id;
            const updates = { conversation: conversationJson };
            if (info?.name) updates.name = info.name;
            if (info?.phone) updates.phone = info.phone;
            if (info?.email) updates.email = info.email;
            await databases.updateDocument(dbId, collId, docId, updates);
          } else {
            await databases.createDocument(dbId, collId, ID.unique(), {
              session_id: sessionId,
              name: info?.name || "",
              phone: info?.phone || "",
              email: info?.email || "",
              conversation: conversationJson,
              status: "new"
            });
          }
        } catch (dbErr) {
          error("Appwrite DB Error: " + dbErr.message);
        }
      }

      return res.json({ reply: cleanReply });

    } catch (aiErr) {
      error("AI Error: " + aiErr.message);
      return res.json({ error: "AI Service Error: " + aiErr.message }, 500);
    }

  } catch (err) {
    error("General Function Error: " + err.message);
    return res.json({ error: "Internal function error" }, 500);
  }
};
