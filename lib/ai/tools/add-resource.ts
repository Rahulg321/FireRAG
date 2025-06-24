import { openai } from '@ai-sdk/openai'
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { createResource } from '../../actions/resources'


export const addResource = tool({
        description: `Use this tool whenever a user provides new information. Add new content to the knowledge base.`,
        parameters: z.object({
          content: z.string().describe('The content to embed and store'),
        }),
        execute: async ({ content }) => {
        console.log('Adding resource to knowledge base', content)

            const msg = await createResource({ content })
          return msg
        },
      })