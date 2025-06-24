'use server'

import { z } from 'zod'
import { upsertEmbedding } from '../upstash-search'

// A simple schema for incoming resource content
const NewResourceSchema = z.object({
  content: z.string().min(1),
})

// Server action to parse the input and upsert to the index
export async function createResource(input: { content: string }) {
  const { content } = NewResourceSchema.parse(input)

  // Generate a random ID
  const resourceId = crypto.randomUUID()
  // Upsert the chunks/embeddings to Upstash Vector
  await upsertEmbedding(resourceId, content)

  return `Resource ${resourceId} created and embedded.`
}