"use client";

import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { Loader2, Send, RotateCcw, Square } from "lucide-react";
import { Bot } from "@/lib/db/schema";

const BotChatScreen = ({ bot }: { bot: Bot }) => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    error,
    reload,
  } = useChat({
    api: "/api/bot-chat",
    body: {
      botId: bot.id,
      language: bot.botLanguage,
      greeting: bot.greeting,
      brandGuidelines: bot.brandGuidelines,
      instructions: bot.instructions,
      tone: bot.tone,
    },
    onFinish: (message, { usage, finishReason }) => {
      console.log("Finished streaming message:", message);
      console.log("Token usage:", usage);
      console.log("Finish reason:", finishReason);
    },
    onError: (error) => {
      console.error("An error occurred:", error);
    },
    onResponse: (response) => {
      console.log("Received HTTP response from server:", response);
    },
  });

  return (
    <div className="flex flex-col size-full max-w-4xl mx-auto ">
      <div className="flex-1 p-4 pb-28 space-y-4 min-h-[400px] max-w-4xl w-full mx-auto overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p className="text-lg font-medium">
              Start a conversation with {bot.name || "your bot"}
            </p>
            <p className="text-sm mt-2">
              Ask anything and get instant responses!
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 bg-muted text-foreground dark:bg-muted/80 dark:text-foreground`}
            >
              <div className="text-sm font-medium mb-1">
                {message.role === "user" ? "You" : "AI"}
              </div>
              <div className="prose max-w-none">
                <ReactMarkdown className="prose prose-sm dark:prose-invert">
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {error && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-md">
              <p className="text-destructive font-medium mb-2">
                Something went wrong
              </p>
              <p className="text-destructive/80 text-sm mb-3">
                Please try again
              </p>
              <button
                type="button"
                onClick={() => reload()}
                className="inline-flex items-center gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <RotateCcw className="size-4" />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {(status === "submitted" || status === "streaming") && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-3 max-w-[80%]">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-sm">AI is thinking...</span>
                <button
                  type="button"
                  onClick={() => stop()}
                  className="ml-2 p-1 hover:bg-muted/50 rounded transition-colors"
                  title="Stop generation"
                >
                  <Square className="size-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl flex gap-2 p-4 bg-background border-t border-border"
        style={{ zIndex: 10 }}
      >
        <input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none bg-background text-foreground"
          disabled={status === "submitted" || status === "streaming"}
        />
        <button
          type="submit"
          disabled={
            !input.trim() || status === "submitted" || status === "streaming"
          }
          className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Send className="size-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};

export default BotChatScreen;
