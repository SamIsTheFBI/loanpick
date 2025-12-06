"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Product, ChatMessage } from "@/lib/types";

interface ChatInputProps {
  product: Product;
  messages: ChatMessage[];
  onResponse: (message: ChatMessage) => void;
}

export function ChatInput({ product, messages, onResponse }: ChatInputProps) {
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: trimmed,
    };

    onResponse(userMessage);
    setValue("");
    setLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          message: trimmed,
          history,
        }),
      });

      if (!res.ok) throw new Error("Failed to get AI response");

      const data = await res.json();
      onResponse({ role: "assistant", content: data.response });
    } catch (error) {
      onResponse({ role: "assistant", content: "Sorry, something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2 mt-4 static">
      <Input
        placeholder="Ask something about this loan..."
        value={value}
        disabled={loading}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            void handleSend();
          }
        }}
      />
      <Button onClick={handleSend} disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </Button>
    </div>
  );
}
