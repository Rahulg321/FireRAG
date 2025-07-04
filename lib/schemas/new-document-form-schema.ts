import { z } from "zod";

export const newDocumentFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  botId: z.string().min(1),
});