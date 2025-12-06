"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

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
          className={`max-w-[80%] p-3 rounded-lg text-sm ${
            m.role === "assistant"
              ? "bg-muted text-foreground"
              : "bg-primary text-primary-foreground ml-auto"
          }`}
        >
          {m.role === "assistant" ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  code: ({ children }) => (
                    <code className="bg-muted-foreground/20 px-1 py-0.5 rounded text-xs">
                      {children}
                    </code>
                  ),
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          ) : (
            m.content
          )}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
