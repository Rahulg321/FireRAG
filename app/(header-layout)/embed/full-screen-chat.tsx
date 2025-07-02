"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface BotData {
  id: string;
  name: string;
  welcomeMessage: string;
  primaryColor: string;
  botAvatar: string;
  settings: {
    showTypingIndicator: boolean;
    enableSoundEffects: boolean;
    maxMessageLength: number;
  };
}

interface FullScreenChatInterfaceProps {
  botData: BotData;
}

export default function FullScreenChatInterface({
  botData,
}: FullScreenChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: botData.welcomeMessage,
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || input.length > botData.settings.maxMessageLength)
      return;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (botData.settings.showTypingIndicator) setIsTyping(true);
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Thanks for your message! I'm ${botData.name}. This is a placeholder response.`,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full border-b bg-white dark:bg-gray-900 px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-muted">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {botData.name}
          </h1>
          <span className="text-xs text-muted-foreground">AI Assistant</span>
        </div>
      </header>
      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-2 py-4 sm:px-0">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-end gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted">
                  {message.role === "user" ? (
                    <User className="w-4 h-4 text-primary" />
                  ) : (
                    <Bot className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div
                  className={`px-4 py-2 rounded-lg text-sm shadow-sm max-w-xs break-words ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none border"
                  }`}
                >
                  <span>{message.content}</span>
                  <div className="text-[10px] text-muted-foreground mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="px-4 py-2 rounded-lg bg-muted text-foreground border flex items-center gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <span
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>
      {/* Input */}
      <footer className="w-full border-t bg-white dark:bg-gray-900 px-4 py-3">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${botData.name}...`}
            className="flex-1"
            disabled={isTyping}
            maxLength={botData.settings.maxMessageLength}
            autoComplete="off"
          />
          <Button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="flex items-center gap-1"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <div className="text-xs text-muted-foreground mt-1 max-w-2xl mx-auto text-right">
          {input.length}/{botData.settings.maxMessageLength} characters
        </div>
      </footer>
    </div>
  );
}
