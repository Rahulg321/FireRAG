import { tool } from "ai";
import { z } from "zod";
import { findRelevantContent } from "../embedding-calls";

export const getInformation = tool({
  description: `get information from your knowledge base to answer questions. You can use this tool to get information from your knowledge base. Call this tool with the botId and the question.`,
  parameters: z.object({
    botId: z.string().describe("the bot id"),
    question: z.string().describe("the users question"),
  }),
  execute: async ({ question, botId }) => {
    console.log("--------------------------------");
    console.log("botId", botId);
    console.log("question", question);

    const relevantContent = await findRelevantContent(question, botId);
    return relevantContent;
  },
});
