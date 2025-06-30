'use server'

import { z } from 'zod'
import { upsertEmbedding } from '../upstash-search'

const NewResourceSchema = z.object({
  content: z.string().min(1),
})

export async function createResource(input: { content: string }) {
  const { content } = NewResourceSchema.parse(input)

  const resourceId = crypto.randomUUID()
  await upsertEmbedding(resourceId, content)

  return `Resource ${resourceId} created and embedded.`
}