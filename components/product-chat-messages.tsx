"use client";

export function ChatMessages({ messages }: { messages: { role: string; content: string }[] }) {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 mt-4 p-2 border rounded-md bg-muted/30">
      {messages.map((m, i) => (
        <div
          key={i}
          className={`max-w-[80%] p-3 rounded-lg text-sm ${m.role === "assistant"
              ? "bg-muted text-foreground self-start"
              : "bg-primary text-primary-foreground ml-auto"
            }`}
        >
          {m.content}
        </div>
      ))}
    </div>
  );
}
