import { auth } from "@/app/(main-site)/(auth)/auth";
import { getCreatedBotsByUserId } from "@/lib/db/queries";
import { Bot } from "@/lib/db/schema";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Created Bots",
  description: "Created Bots",
};

const CreatedBotsPage = async () => {
  const userSession = await auth();
  if (!userSession?.user) {
    redirect("/login");
  }

  return (
    <div className="block-space big-container">
      <h1 className="text-2xl font-bold">Created Bots</h1>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <DisplayBotByUser userId={userSession.user.id} />
        </Suspense>
      </div>
    </div>
  );
};

export default CreatedBotsPage;

async function DisplayBotByUser({ userId }: { userId: string }) {
  const createdBots = await getCreatedBotsByUserId(userId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {createdBots?.map((bot) => {
        return <BotCard key={bot.id} bot={bot} />;
      })}
    </div>
  );
}

function BotCard({ bot }: { bot: Bot }) {
  return (
    <div>
      <Card className="flex flex-col items-center justify-center">
        <CardHeader>
          <CardTitle>{bot.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{bot.description}</p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href={`/embed/${bot.id}`}>View Bot</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
