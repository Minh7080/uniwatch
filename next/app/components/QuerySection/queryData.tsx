import z from "zod";

const querySchema = z.object({
  sources:    z.array(z.string()).min(1).optional(),
  sort:       z.enum(["new", "top", "hot", "controversial"]),
  search:     z.string().optional(),
  dateRange:  z.object({ from: z.string(), to: z.string() }).optional(),
  topics:     z.array(z.string()).min(1).optional(),
  irony:      z.string().optional(),
  emotions:   z.array(z.string()).min(1).optional(),
  sentiments: z.array(z.string()).min(1).optional(),
  hateSpeech: z.string().optional(),
  offensive:  z.string().optional(),
});

type QueryData = z.input<typeof querySchema>;
type QueryPayload = z.output<typeof querySchema>;

export { querySchema };
export type { QueryData, QueryPayload };
