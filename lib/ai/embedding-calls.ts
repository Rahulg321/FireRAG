import { cosineDistance, desc, gt, sql, eq, and } from "drizzle-orm";
import { botResourceEmbeddings, botResources } from "../db/schema";
import { generateEmbedding } from "./embedding";
import { db } from "../db/queries";

export const findRelevantContent = async (userQuery: string, botId: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);

  const similarity = sql<number>`1 - (${cosineDistance(
    botResourceEmbeddings.embedding,
    userQueryEmbedded
  )})`;

  const [mostRelevant] = await db
    .select({ content: botResourceEmbeddings.content, similarity })
    .from(botResourceEmbeddings)
    .innerJoin(
      botResources,
      eq(botResources.id, botResourceEmbeddings.botResourceId)
    )
    .where(and(eq(botResources.botId, botId), gt(similarity, 0.7)))
    .orderBy((t) => desc(t.similarity))
    .limit(1);

  if (!mostRelevant) return null;

  // Truncate content to 300 characters
  return {
    ...mostRelevant,
    content: mostRelevant.content,
  };
};
