import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";
import { products, ai_chat_messages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";

const RequestSchema = z.object({
  productId: z.string().uuid(),
  message: z.string().min(1),
  history: z.array(z.object({
    role: z.enum(["user", "model"]),
    parts: z.array(z.object({ text: z.string() })),
  })),
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, message, history } = RequestSchema.parse(body);

    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const faqList = Array.isArray(product.faq)
      ? product.faq.map((q: any, i: number) => `${i + 1}. Q: ${q.question}\n   A: ${q.answer}`).join("\n\n")
      : "No FAQ available";

    const prompt = `You are a helpful financial assistant for a loan comparison platform. Answer questions about this loan product:

Product: ${product.name}
Bank: ${product.bank}
Type: ${product.type}
Interest Rate: ${product.rate_apr}% APR
Minimum Income: ₹${Number(product.min_income).toLocaleString("en-IN")}
Minimum Credit Score: ${product.min_credit_score}
Tenure: ${product.tenure_min_months} - ${product.tenure_max_months} months
Processing Fee: ${product.processing_fee_pct}%
Prepayment: ${product.prepayment_allowed ? "Allowed" : "Not allowed"}
Disbursal Speed: ${product.disbursal_speed}
Documentation: ${product.docs_level}

${product.summary ? `Summary: ${product.summary}` : ""}

FAQ:
${faqList}

Guidelines:
- Be clear, concise, and helpful in all responses
- Use only the product information explicitly provided
- Do not assume, infer, or make up any details beyond the given data
- If asked about products not available, politely state the limitation and redirect to the available products
- Maintain a neutral, informative (non-promotional) tone
- Format all monetary values using Indian numbering (e.g., ₹50,000, ₹2.5 lakh, ₹1 crore)
- If required information is missing or unavailable, clearly say so instead of guessing
- Keep responses structured and easy to read `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const chat = model.startChat({ history: [{ role: "user", parts: [{ text: prompt }] }, { role: "model", parts: [{ text: "I understand. I'll help answer questions about this loan product." }] }, ...history] });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    await db.insert(ai_chat_messages).values([
      { user_id: session.user.id, product_id: productId, role: "user", content: message },
      { user_id: session.user.id, product_id: productId, role: "assistant", content: response },
    ]);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: "Failed to process your message. Please try again." },
      { status: 500 }
    );
  }
}
