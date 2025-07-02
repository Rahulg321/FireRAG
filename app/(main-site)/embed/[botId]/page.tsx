import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ botId: string }>;
}) {
  const { botId } = await params;
}

const BotEmbedPage = async ({
  params,
}: {
  params: Promise<{ botId: string }>;
}) => {
  const { botId } = await params;

  return <div>BotEmbedPage</div>;
};

export default BotEmbedPage;
