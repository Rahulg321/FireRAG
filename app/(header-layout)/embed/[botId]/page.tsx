import BotChatScreen from "./bot-chat-screen";
import { getBotById } from "@/lib/db/queries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Custom Bot",
  description: "Custom Bot",
};

const CustomBotPage = async ({
  params,
}: {
  params: Promise<{ botId: string }>;
}) => {
  const { botId } = await params;
  const bot = await getBotById(botId);

  if (!bot) {
    return notFound();
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-center">
        {bot.name} - {bot.botLanguage}
      </h3>
      <BotChatScreen bot={bot} />
    </div>
  );
};

export default CustomBotPage;
