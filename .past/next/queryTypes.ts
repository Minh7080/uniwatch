import { z } from 'zod';

export const QuerySchema = z.object({
  sources: z.array(z.string()).optional(),

  dateRanges: z
    .object({
      from: z.string(),
      to: z.string(),
    })
    .optional(),

  topic: z.array(z.string()).optional(),
  searchTerm: z.string().optional(),

  emotion: z.array(z.string()).optional(),
  sentiment: z.array(z.string()).optional(),

  irony: z.boolean().optional(),

  upvotes: z
    .object({
      min: z.number(),
      max: z.number(),
    })
    .refine((v) => v.min <= v.max, { message: 'upvotes.min must be <= upvotes.max' })
    .optional(),

  comments: z
    .object({
      min: z.number(),
      max: z.number(),
    })
    .refine((v) => v.min <= v.max, { message: 'comments.min must be <= comments.max' })
    .optional(),

  upvoteRatio: z.number().min(0).max(1).optional(),

  hateSpeech: z.boolean().optional(),
  offensive: z.boolean().optional(),

  sort: z.enum([
    'new',
    'top',
    'hot',
    'controversial',
  ]),

  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(200).default(50),
});

export type QueryType = z.infer<typeof QuerySchema>;
