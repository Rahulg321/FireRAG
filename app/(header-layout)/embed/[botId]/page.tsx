"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FullScreenChatInterface from "../full-screen-chat";
import EmbeddableWidget from "../embeddable-widget";

// Mock bot data - replace with actual API call
const getBotData = async (id: string) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    id,
    name: `Bot ${id}`,
    welcomeMessage: `Hi! I'm Bot ${id}. How can I help you today?`,
    primaryColor: "#3B82F6",
    botAvatar: "/placeholder.svg?height=40&width=40&text=Bot",
    settings: {
      showTypingIndicator: true,
      enableSoundEffects: false,
      maxMessageLength: 500,
    },
  };
};

export default function BotPage() {
  console.log("BotPage");
  const params = useParams();
  const [isInIframe, setIsInIframe] = useState(false);
  const [botData, setBotData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Detect if page is loaded in iframe
    const checkIfInIframe = () => {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    };

    setIsInIframe(checkIfInIframe());

    // Load bot data
    const loadBotData = async () => {
      try {
        const data = await getBotData(params.id as string);
        setBotData(data as any);
      } catch (error) {
        console.error("Failed to load bot data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBotData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!botData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Bot Not Found
          </h1>
          <p className="text-gray-600">The requested bot could not be found.</p>
        </div>
      </div>
    );
  }

  // Render widget version for iframe
  if (isInIframe) {
    return <EmbeddableWidget botData={botData} />;
  }

  // Render full-screen version for direct access
  return <FullScreenChatInterface botData={botData} />;
}
