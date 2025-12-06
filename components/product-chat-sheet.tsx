"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import type { Product, ChatMessage } from "@/lib/types";
import { ChatMessages } from "./product-chat-messages";
import { ChatInput } from "./product-chat-input";

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

  return (
    <Sheet open={open} onOpenChange={onCloseAction}>
      <SheetContent side="right" className="w-full sm:max-w-md px-0">
        <SheetHeader className="px-4">
          <SheetTitle>{product.name}</SheetTitle>
          <p className="text-sm text-muted-foreground">{product.bank}</p>
        </SheetHeader>

        <div className="flex flex-col h-full px-4">
          <ChatMessages messages={messages} />

          <ChatInput
            product={product}
            messages={messages}
            onResponse={(msg) => setMessages((m) => [...m, msg])}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
