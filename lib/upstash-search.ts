import { Index } from '@upstash/vector'


const index = new Index({
  url: process.env.UPSTASH_SEARCH_REST_URL!,
  token: process.env.UPSTASH_SEARCH_REST_TOKEN!,
})

function generateChunks(input: string): string[] {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '')
}

/**
 * Upsert embedding for a resource
 * @param resourceId - The id of the resource
 * @param content - The content of the resource
 */
export async function upsertEmbedding(resourceId: string, content: string) {
  const chunks = generateChunks(content)
  const toUpsert = chunks.map((chunk, i) => ({
    id: `${resourceId}-${i}`,
    data: chunk,
    metadata: {
      resourceId,
      content: chunk, 
    },
  }))

  await index.upsert(toUpsert)

}

// Query
export async function findRelevantContent(query: string, k = 4) {
  const result = await index.query({
    data: query, 
    topK: k,
    includeMetadata: true, 
  })

  return result
}