"use client";

import { useEffect, useRef } from "react";

export function ChatMessages({ messages }: { messages: { role: string; content: string }[] }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="space-y-4">
      {messages.map((m, i) => (
        <div
          key={i}
          className={`max-w-[80%] p-3 rounded-lg text-sm ${m.role === "assistant"
              ? "bg-muted text-foreground"
              : "bg-primary text-primary-foreground ml-auto"
            }`}
        >
          {m.content}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
