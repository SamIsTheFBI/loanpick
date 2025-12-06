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

interface AskApiResponse {
  answer: string;
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

    // Optimistically add the user message to UI
    onResponse(userMessage);
    setValue("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          message: trimmed,
          history: [...messages, userMessage],
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = (await res.json()) as AskApiResponse;

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.answer,
      };

      onResponse(assistantMessage);
    } catch (error) {
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, something went wrong while fetching the answer.",
      };
      onResponse(assistantMessage);
      // Optionally log error to console
      // console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2 mt-4">
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
