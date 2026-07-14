import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Chave da API não configurada");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Usando o modelo padrão e garantido
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    const prompt = `Você é um diário reflexivo e empático. O usuário escreveu o seguinte desabafo: "${text}". 
    Responda com uma reflexão curta, acolhedora e positiva, como um amigo sábio.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return NextResponse.json({ reply: response });
    
  } catch (error) {
    console.error("Erro na API de chat:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}