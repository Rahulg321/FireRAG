import { findRelevantContent } from "@/lib/upstash-search"
import { z } from "zod"
import { tool } from "ai"

export const getInformation = tool({
        description: `Retrieve relevant knowledge from your knowledge base to answer user queries.`,
        parameters: z.object({
          question: z.string().describe('The question to search for'),
        }),
        execute: async ({ question }) => {
          console.log('Getting information from knowledge base', question)
            const hits = await findRelevantContent(question)
            console.log('Hits', hits)
          return hits
        },
      })