import { NextRequest } from "next/server";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

function mockReply(messages: ChatMessage[]): string {
  const last = [...messages].reverse().find(m => m.role === "user")?.content ?? "";
  const lower = last.toLowerCase();

  if (lower.includes("journalism")) {
    return "Journalism is the activity of gathering, assessing, creating, and presenting news and information to the public.";
  }

  return ` Mock mode: You said "${last}". Here's a fake helpful reply!`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid body: { messages: ChatMessage[] }", { status: 400 });
    }

    //  If mock mode is enabled, skip API call entirely
    if (process.env.MOCK_OPENAI === "true") {
      return Response.json({ reply: mockReply(messages) });
    }

    // Otherwise, try OpenAI API
    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ reply: "No API key provided. Enable MOCK_OPENAI or set a key." });
    }

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return Response.json({ reply: `OpenAI error: ${errText}` });
    }

    const data = await resp.json();
    return Response.json({ reply: data.choices?.[0]?.message?.content ?? "" });
  } catch (e: any) {
    return Response.json({ reply: `Server error: ${e?.message ?? "unknown"}` });
  }
}
