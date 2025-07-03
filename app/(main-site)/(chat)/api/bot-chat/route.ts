import { buildBotSystempPrompt } from "@/lib/ai/bot-base-prompt";
import { getInformation } from "@/lib/ai/tools/find-relevant-content";
import { openaiProvider } from "@/lib/ai/providers";
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

  const result = streamText({
    model: openaiProvider("gpt-4o"),
    system: buildBotSystempPrompt({
      botName,
      instructions,
      tone,
      language,
      greeting,
      brandGuidelines,
    }),
    messages,
    tools: { getInformation },
  });

  return result.toDataStreamResponse();
}
