import "server-only";

import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  inArray,
  lt,
  ilike,
  type SQL,
} from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
  user,
  chat,
  type User,
  document,
  type Suggestion,
  suggestion,
  message,
  vote,
  type DBMessage,
  type Chat,
  stream,
  passwordResetToken,
  verificationToken,
  bot,
  botResources,
} from "./schema";
import type { ArtifactKind } from "@/components/artifact";
import { generateUUID } from "../utils";
import { generateHashedPassword } from "./utils";
import type { VisibilityType } from "@/components/visibility-selector";
import { ChatSDKError } from "../errors";
import { BotDocument, BotWithDocumentsCount } from "../types";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
export const db = drizzle(client);

/**
 * Get filtered bot documents by user id with pagination
 * @param userId - The id of the user
 * @param query - Optional search query for file name
 * @param offset - Optional offset for pagination
 * @param limit - Optional limit for pagination
 * @returns The filtered bot documents, total pages, and total documents
 */
export async function getBotDocumentsByUserId(
  userId: string,
  query?: string,
  offset?: number,
  limit?: number
) {
  try {
    const whereClause = query
      ? ilike(botResources.name, `%${query}%`)
      : undefined;

    const documents = await db
      .select({
        id: botResources.id,
        botId: botResources.botId,
        botName: bot.name,
        fileName: botResources.name,
        fileType: botResources.kind,
        fileSize: botResources.fileSize,
        createdAt: botResources.createdAt,
      })
      .from(botResources)
      .leftJoin(bot, eq(botResources.botId, bot.id))
      .where(and(eq(botResources.userId, userId), whereClause))
      .orderBy(desc(botResources.createdAt))
      .limit(limit ?? 50)
      .offset(offset ?? 0);

    const [{ total }] = await db
      .select({ total: count(botResources.id) })
      .from(botResources)
      .where(and(eq(botResources.userId, userId), whereClause));

    const totalPages = Math.ceil(Number(total) / (limit ?? 50));

    // Ensure botName is always a string
    const safeDocuments = documents.map((doc) => ({
      ...doc,
      botName: doc.botName ?? "",
    }));

    return { documents: safeDocuments, totalPages, totalDocuments: total };
  } catch (error) {
    console.log(
      "An error occurred trying to get filtered bot documents by user id",
      error
    );
    return { documents: [], totalPages: 0, totalDocuments: 0 };
  }
}

/**
 * Get a bot by id
 * @param id - The id of the bot
 * @returns The bot
 */
export async function getBotById(id: string) {
  try {
    const [foundBot] = await db.select().from(bot).where(eq(bot.id, id));
    return foundBot;
  } catch (error) {
    console.log("An error occured trying to get bot by id", error);
    return null;
  }
}

/**
 * Get a user by id
 * @param id - The id of the user
 * @returns The user
 */
export async function getUserById(id: string) {
  try {
    const [foundUser] = await db.select().from(user).where(eq(user.id, id));
    return foundUser;
  } catch (error) {
    console.log("An error occured trying to get user by id", error);
    return null;
  }
}

/**
 * Get a password reset token by email
 * @param email - The email to get the password reset token for
 * @returns The password reset token
 */
export async function getPasswordResetTokenByEmail(email: string) {
  try {
    const [foundPasswordResetToken] = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.email, email));
    return foundPasswordResetToken;
  } catch (error) {
    console.log(
      "An error occured trying to get password reset token by email",
      error
    );
    return null;
  }
}

/**
 * Get a verification token by email
 * @param email - The email to get the verification token for
 * @returns The verification token
 */
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const [userVerificationToken] = await db
      .select()
      .from(verificationToken)
      .where(eq(verificationToken.email, email));
    return userVerificationToken;
  } catch (error) {
    console.log(
      "An error occured trying to get verification token by email",
      error
    );
    return null;
  }
};

/**
 * Get a password reset token by token
 * @param token - The token to get the password reset token for
 * @returns The password reset token
 */
export async function getPasswordResetTokenByToken(token: string) {
  try {
    const [foundPasswordResetToken] = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.token, token));

    return foundPasswordResetToken;
  } catch (error) {
    console.log(
      "An error occured trying to get password reset token by token",
      error
    );
    return null;
  }
}

/**
 * Get created bots by user id
 * @param userId - The id of the user
 * @returns The created bots
 */
export async function getCreatedBotsByUserId(userId: string) {
  try {
    const foundCreatedBots = await db
      .select()
      .from(bot)
      .where(eq(bot.userId, userId));
    return foundCreatedBots;
  } catch (error) {
    console.log(
      "An error occured trying to get created bots by user id",
      error
    );
    return null;
  }
}

/**
 * Fetch bots with documents count
 * @param userId - The id of the user
 * @returns The bots with documents count
 * @example
 * ```typescript
 * // Example return value:
 * [
 *   { id: "bot-1", name: "Customer Support", documentCount: 5 },
 *   { id: "bot-2", name: "Sales Assistant", documentCount: 0 }
 * ]
 * ```
 */
export async function fetchBotsWithDocumentsCount(
  userId: string
): Promise<BotWithDocumentsCount> {
  try {
    const foundBots = await db
      .select({
        id: bot.id,
        name: bot.name,
        documentCount: count(botResources.id),
      })
      .from(bot)
      .leftJoin(botResources, eq(bot.id, botResources.botId))
      .where(eq(bot.userId, userId))
      .groupBy(bot.id, bot.name)
      .orderBy(asc(bot.name))
      .execute();
    return foundBots;
  } catch (error) {
    console.log(
      "An error occured trying to fetch bots with documents count",
      error
    );
    return null;
  }
}

/**
 * Get a verification token by token
 * @param token - The token to get the verification token for
 * @returns The verification token
 */
export async function getVerificationTokenByToken(token: string) {
  try {
    const [foundVerificationToken] = await db
      .select()
      .from(verificationToken)
      .where(eq(verificationToken.token, token));
    return foundVerificationToken;
  } catch (error) {
    console.log(
      "An error occured trying to get verification token by token",
      error
    );
    return null;
  }
}

/**
 * Get a user by email
 * @param email - The email to get the user for
 * @returns The user
 */
export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get user by email"
    );
  }
}

export async function createUser(email: string, password: string) {
  const hashedPassword = generateHashedPassword(password);

  try {
    return await db.insert(user).values({ email, password: hashedPassword });
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to create user");
  }
}

export async function createGuestUser() {
  const email = `guest-${Date.now()}`;
  const password = generateHashedPassword(generateUUID());

  try {
    return await db.insert(user).values({ email, password }).returning({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to create guest user"
    );
  }
}

export async function saveChat({
  id,
  userId,
  title,
  visibility,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: VisibilityType;
}) {
  try {
    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      userId,
      title,
      visibility,
    });
  } catch (error) {
    console.error(error);
    throw new ChatSDKError("bad_request:database", "Failed to save chat");
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.delete(vote).where(eq(vote.chatId, id));
    await db.delete(message).where(eq(message.chatId, id));
    await db.delete(stream).where(eq(stream.chatId, id));

    const [chatsDeleted] = await db
      .delete(chat)
      .where(eq(chat.id, id))
      .returning();
    return chatsDeleted;
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete chat by id"
    );
  }
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  try {
    const extendedLimit = limit + 1;

    const query = (whereCondition?: SQL<any>) =>
      db
        .select()
        .from(chat)
        .where(
          whereCondition
            ? and(whereCondition, eq(chat.userId, id))
            : eq(chat.userId, id)
        )
        .orderBy(desc(chat.createdAt))
        .limit(extendedLimit);

    let filteredChats: Array<Chat> = [];

    if (startingAfter) {
      const [selectedChat] = await db
        .select()
        .from(chat)
        .where(eq(chat.id, startingAfter))
        .limit(1);

      if (!selectedChat) {
        throw new ChatSDKError(
          "not_found:database",
          `Chat with id ${startingAfter} not found`
        );
      }

      filteredChats = await query(gt(chat.createdAt, selectedChat.createdAt));
    } else if (endingBefore) {
      const [selectedChat] = await db
        .select()
        .from(chat)
        .where(eq(chat.id, endingBefore))
        .limit(1);

      if (!selectedChat) {
        throw new ChatSDKError(
          "not_found:database",
          `Chat with id ${endingBefore} not found`
        );
      }

      filteredChats = await query(lt(chat.createdAt, selectedChat.createdAt));
    } else {
      filteredChats = await query();
    }

    const hasMore = filteredChats.length > limit;

    return {
      chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
      hasMore,
    };
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get chats by user id"
    );
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get chat by id");
  }
}

export async function saveMessages({
  messages,
}: {
  messages: Array<DBMessage>;
}) {
  try {
    return await db.insert(message).values(messages);
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to save messages");
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get messages by chat id"
    );
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: "up" | "down";
}) {
  try {
    const [existingVote] = await db
      .select()
      .from(vote)
      .where(and(eq(vote.messageId, messageId)));

    if (existingVote) {
      return await db
        .update(vote)
        .set({ isUpvoted: type === "up" })
        .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
    }
    return await db.insert(vote).values({
      chatId,
      messageId,
      isUpvoted: type === "up",
    });
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to vote message");
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return await db.select().from(vote).where(eq(vote.chatId, id));
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get votes by chat id"
    );
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  try {
    return await db
      .insert(document)
      .values({
        id,
        title,
        kind,
        content,
        userId,
        createdAt: new Date(),
      })
      .returning();
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to save document");
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    const documents = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(asc(document.createdAt));

    return documents;
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get documents by id"
    );
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    const [selectedDocument] = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(desc(document.createdAt));

    return selectedDocument;
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get document by id"
    );
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    await db
      .delete(suggestion)
      .where(
        and(
          eq(suggestion.documentId, id),
          gt(suggestion.documentCreatedAt, timestamp)
        )
      );

    return await db
      .delete(document)
      .where(and(eq(document.id, id), gt(document.createdAt, timestamp)))
      .returning();
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete documents by id after timestamp"
    );
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<Suggestion>;
}) {
  try {
    return await db.insert(suggestion).values(suggestions);
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to save suggestions"
    );
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    return await db
      .select()
      .from(suggestion)
      .where(and(eq(suggestion.documentId, documentId)));
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get suggestions by document id"
    );
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await db.select().from(message).where(eq(message.id, id));
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message by id"
    );
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const messagesToDelete = await db
      .select({ id: message.id })
      .from(message)
      .where(
        and(eq(message.chatId, chatId), gte(message.createdAt, timestamp))
      );

    const messageIds = messagesToDelete.map((message) => message.id);

    if (messageIds.length > 0) {
      await db
        .delete(vote)
        .where(
          and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds))
        );

      return await db
        .delete(message)
        .where(
          and(eq(message.chatId, chatId), inArray(message.id, messageIds))
        );
    }
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete messages by chat id after timestamp"
    );
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: "private" | "public";
}) {
  try {
    return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to update chat visibility by id"
    );
  }
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: {
  id: string;
  differenceInHours: number;
}) {
  try {
    const twentyFourHoursAgo = new Date(
      Date.now() - differenceInHours * 60 * 60 * 1000
    );

    const [stats] = await db
      .select({ count: count(message.id) })
      .from(message)
      .innerJoin(chat, eq(message.chatId, chat.id))
      .where(
        and(
          eq(chat.userId, id),
          gte(message.createdAt, twentyFourHoursAgo),
          eq(message.role, "user")
        )
      )
      .execute();

    return stats?.count ?? 0;
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message count by user id"
    );
  }
}

export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) {
  try {
    await db
      .insert(stream)
      .values({ id: streamId, chatId, createdAt: new Date() });
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to create stream id"
    );
  }
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  try {
    const streamIds = await db
      .select({ id: stream.id })
      .from(stream)
      .where(eq(stream.chatId, chatId))
      .orderBy(asc(stream.createdAt))
      .execute();

    return streamIds.map(({ id }) => id);
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get stream ids by chat id"
    );
  }
}
