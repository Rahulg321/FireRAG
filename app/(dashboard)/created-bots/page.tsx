import { auth } from "@/app/(main-site)/(auth)/auth";
import { getCreatedBotsByUserId } from "@/lib/db/queries";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Created Bots",
  description: "Created Bots",
};

const CreatedBotsPage = async () => {
  const userSession = await auth();
  if (!userSession?.user) {
    redirect("/login");
  }

  const createdBots = await getCreatedBotsByUserId(userSession.user.id);
  return (
    <div>
      <h1>Created Bots</h1>
      <div>
        {createdBots?.map((bot) => {
          return <div key={bot.id}>{bot.name}</div>;
        })}
      </div>
    </div>
  );
};

export default CreatedBotsPage;
