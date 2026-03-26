import { NextResponse } from "next/server";
import { Client, Functions } from "node-appwrite";

// ─── Appwrite Server Client ───
const appwriteClient = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
  .setKey(process.env.APPWRITE_API_KEY || "");

const functions = new Functions(appwriteClient);

// The ID of the function deployed on Appwrite
const VERTEX_FUNCTION_ID = process.env.NEXT_PUBLIC_APPWRITE_VERTEX_FUNCTION_ID || "vertex-chatbot";

// ─── Main API Handler ───
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { history = [], message, sessionId } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    try {
      console.log("Executing Appwrite Function:", VERTEX_FUNCTION_ID);
      
      const execution = await functions.createExecution(
        VERTEX_FUNCTION_ID,
        JSON.stringify({ history, message, sessionId }),
        false
      );

      console.log("Appwrite Function Status:", execution.status);
      console.log("Appwrite Function Response Body:", execution.responseBody);

      if (execution.status === "completed") {
        if (!execution.responseBody) {
          console.error("Function completed but returned empty body");
          return NextResponse.json({ error: "Empty response from AI" }, { status: 500 });
        }

        try {
          const responseData = JSON.parse(execution.responseBody);
          
          if (responseData.error) {
            console.error("Function returned error payload:", responseData.error);
            return NextResponse.json({ error: responseData.error }, { status: 500 });
          }
          
          return NextResponse.json({ reply: responseData.reply || "" });
        } catch (parseErr) {
          console.error("Failed to parse function response:", execution.responseBody);
          return NextResponse.json({ error: "Invalid response format from AI" }, { status: 500 });
        }
      } else {
        console.error("Function execution failed status:", execution.status);
        return NextResponse.json({ error: "AI service failed to execute" }, { status: 500 });
      }

    } catch (funcError: any) {
      console.error("Appwrite Execution Exception:", funcError);
      return NextResponse.json({ 
        error: "AI service connection failed",
        details: funcError?.message || String(funcError)
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Critical API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
