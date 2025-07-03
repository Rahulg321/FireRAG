import { buildBotSystempPrompt } from "@/lib/ai/bot-base-prompt";
import { getInformation } from "@/lib/ai/tools/find-relevant-content";
import { googleAISDKProvider } from "@/lib/ai/providers";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();

  const {
    messages,
    botId,
    language,
    tone,
    greeting,
    brandGuidelines,
    instructions,
    botName,
  } = body;

  const customMessages = [
    {
      role: "user",
      content: `The Bot Name is ${botName} and the botId is ${botId}`,
    },
    ...messages,
  ];

  console.log(customMessages);

  const result = streamText({
    model: googleAISDKProvider("gemini-2.0-flash"),
    maxSteps: 5,
    system: buildBotSystempPrompt({
      botName,
      instructions,
      tone,
      language,
      greeting,
      brandGuidelines,
    }),
    messages: customMessages,
    tools: { getInformation },
  });

  return result.toDataStreamResponse({
    getErrorMessage: (error) => {
      console.error(error);
      return "An error occurred";
    },
  });
}
