import { tool } from "ai";
import { z } from "zod";
import { findRelevantContent } from "../embedding-calls";

export const getInformation = tool({
  description: `get information from your knowledge base to answer questions. You can use this tool to get information from your knowledge base.`,
  parameters: z.object({
    question: z.string().describe("the users question"),
  }),
  execute: async ({ question }) => {
    const relevantContent = await findRelevantContent(question);
    return relevantContent;
  },
});
