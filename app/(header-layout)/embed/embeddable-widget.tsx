"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Minimize2, Bot, User } from "lucide-react";

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

interface EmbeddableWidgetProps {
  botData: BotData;
}

export default function EmbeddableWidget({ botData }: EmbeddableWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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

    if (botData.settings.showTypingIndicator) {
      setIsTyping(true);
    }

    // Simulate AI response (replace with actual API call)
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

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const restoreChat = () => {
    setIsMinimized(false);
  };

  return (
    <>
      <style>{`
        html, body, #__next {
          background: transparent !important;
          box-shadow: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        body {
          background: transparent !important;
        }
      `}</style>
      <div className="fixed bottom-4 right-4 z-50 font-sans">
        {/* Chat Toggle Button */}
        {!isOpen && (
          <Button
            onClick={toggleChat}
            className="rounded-full w-14 h-14 shadow-lg transition-all duration-200 hover:scale-105 bg-primary text-primary-foreground"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <Card
            className={`w-80 sm:w-96 transition-all duration-300 shadow-2xl border-0 flex flex-col ${isMinimized ? "h-14" : "h-96"}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground rounded-t-lg">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span className="font-medium text-sm">{botData.name}</span>
              </div>
              <div className="flex items-center gap-1">
                {!isMinimized && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={minimizeChat}
                    className="text-primary-foreground hover:bg-primary/80 p-1 h-auto"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleChat}
                  className="text-primary-foreground hover:bg-primary/80 p-1 h-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Minimized State */}
            {isMinimized && (
              <div
                className="p-3 cursor-pointer hover:bg-muted transition-colors"
                onClick={restoreChat}
              >
                <p className="text-sm text-muted-foreground">
                  Click to restore chat...
                </p>
              </div>
            )}

            {/* Chat Content */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 p-4 h-64 overflow-y-auto bg-background">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex items-end gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-muted">
                            {message.role === "user" ? (
                              <User className="w-3 h-3 text-primary" />
                            ) : (
                              <Bot className="w-3 h-3 text-primary" />
                            )}
                          </div>
                          <div
                            className={`px-3 py-2 rounded-lg text-sm shadow-sm max-w-xs break-words ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground rounded-br-none"
                                : "bg-muted text-foreground rounded-bl-none border"
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-end gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-muted">
                            <Bot className="w-3 h-3 text-primary" />
                          </div>
                          <div className="px-3 py-2 rounded-lg bg-muted text-foreground border flex items-center gap-1">
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
                  </div>
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t rounded-b-lg">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 text-sm"
                      disabled={isTyping}
                      maxLength={botData.settings.maxMessageLength}
                      autoComplete="off"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isTyping || !input.trim()}
                      className="flex items-center gap-1"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
