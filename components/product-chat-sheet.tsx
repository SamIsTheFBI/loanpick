"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import type { Product, ChatMessage } from "@/lib/types";
import { ChatMessages } from "./product-chat-messages";
import { ChatInput } from "./product-chat-input";
import { toast } from "sonner";

export function ProductChatSheet({
  product,
  open,
  onCloseAction,
}: {
  product: Product;
  open: boolean;
  onCloseAction: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hi! I can answer questions about **${product.name}** from **${product.bank}**.`,
    },
  ]);

  useEffect(() => {
    if (open) {
      fetch(`/api/ai/history?productId=${product.id}`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to load chat history");
          return res.json();
        })
        .then(data => {
          if (data.messages?.length > 0) {
            setMessages([
              {
                role: "assistant",
                content: `Hi! I can answer questions about **${product.name}** from **${product.bank}**.`,
              },
              ...data.messages.map((m: any) => ({
                role: m.role,
                content: m.content,
              })),
            ]);
          }
        })
        .catch((err) => {
          toast.warning("Could not load previous chat history");
        });
    }
  }, [open, product.id, product.name, product.bank]);

  return (
    <Sheet open={open} onOpenChange={onCloseAction}>
      <SheetContent side="right" className="w-full sm:max-w-md px-0 h-screen">
        <SheetHeader className="px-4">
          <SheetTitle>{product.name}</SheetTitle>
          <p className="text-sm text-muted-foreground">{product.bank}</p>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100svh-8rem)] px-4">
          <div className="flex-1 overflow-y-auto mb-4">
            <ChatMessages messages={messages} />
          </div>

          <ChatInput
            product={product}
            messages={messages}
            onResponse={(msg) => {
              if (msg.content === "loading") {
                setMessages((m) => [...m, msg]);
              } else if (msg.role === "assistant") {
                setMessages((m) => [...m.filter(x => x.content !== "loading"), msg]);
              } else {
                setMessages((m) => [...m, msg]);
              }
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
