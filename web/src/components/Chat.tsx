"use client";

import { useState } from "react";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "system", content: "You are a helpful assistant for a journalism app." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const mockActive = process.env.NEXT_PUBLIC_MOCK_OPENAI === "true";

  async function sendMessage() {
    const text = input.trim();
    if (!text || sending) return;

    const next = [...messages, { role: "user", content: text } as ChatMessage];
    setMessages(next);
    setInput("");
    setSending(true);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!resp.ok) {
        let errText = "";
        try { errText = await resp.text(); } catch {}
        throw new Error(errText || `HTTP ${resp.status}`);
      }

      const data = await resp.json();
      const reply = (data?.reply as string) ?? "";
      setMessages((cur) => [...cur, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setMessages((cur) => [
        ...cur,
        { role: "assistant", content: `Sorry, something went wrong: ${e?.message ?? "unknown error"}` },
      ]);
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Mock mode banner */}
      {mockActive && (
        <div className="text-sm border border-dashed border-zinc-600 text-zinc-300 rounded-lg px-3 py-2">
          🔧 Mock mode is ON — responses are generated locally (no API calls).
        </div>
      )}

      {/* Messages area */}
      <div className="border border-zinc-700 rounded-xl p-4 h-[60vh] overflow-y-auto space-y-3 bg-zinc-900">
        {messages
          .filter((m) => m.role !== "system")
          .map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
              <div
                className={
                  "inline-block rounded-xl px-4 py-2 max-w-[85%] break-words " +
                  (m.role === "user"
                    ? "bg-blue-600 text-white"      // user bubble: dark blue with white text
                    : "bg-zinc-200 text-black")     // assistant bubble: light gray with black text
                }
              >
                {m.content}
              </div>
            </div>
          ))}

        {sending && (
          <div className="text-left">
            <div className="inline-block rounded-xl px-4 py-2 bg-zinc-200 text-black">
              Thinking…
            </div>
          </div>
        )}
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <input
          className="flex-1 border border-zinc-700 bg-zinc-900 text-zinc-100 rounded-lg px-3 py-2 outline-none placeholder:text-zinc-500"
          placeholder="Type your message and press Enter…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button
          onClick={sendMessage}
          disabled={sending || !input.trim()}
          className="border border-zinc-700 text-zinc-100 bg-zinc-900 rounded-lg px-4 py-2 disabled:opacity-50 hover:bg-zinc-800 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
