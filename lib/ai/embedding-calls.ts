import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { botResourceEmbeddings, embeddings } from "../db/schema";
import { generateEmbedding } from "./embedding";
import { db } from "../db/queries";

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    botResourceEmbeddings.embedding,
    userQueryEmbedded
  )})`;
  const similarGuides = await db
    .select({ name: botResourceEmbeddings.content, similarity })
    .from(botResourceEmbeddings)
    .where(gt(similarity, 0.7))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
  return similarGuides;
};
