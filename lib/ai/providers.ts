import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { xai } from "@ai-sdk/xai";
import { isTestEnvironment } from "../constants";
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from "./models.test";
import { createOpenAI } from "@ai-sdk/openai";
import OpenAI from "openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { GoogleGenAI } from "@google/genai";


export const googleGenAIProvider = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_AI_KEY,
});

export const googleAISDKProvider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GEMINI_AI_KEY,
});

export const openaiProvider = createOpenAI({
  apiKey: process.env.AI_API_KEY,
  compatibility: "strict",
});

export const openaiClient = new OpenAI({
  apiKey: process.env.AI_API_KEY,
});


export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': openaiProvider('gpt-4o'),
        'chat-model-reasoning': wrapLanguageModel({
          model: openaiProvider('o3-mini'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        
        'title-model': openaiProvider('gpt-4o'),
        'artifact-model': openaiProvider('gpt-4o'),
      },
    });
