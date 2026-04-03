import z from "zod";

const querySchema = z.object({
  sources:    z.array(z.string()).min(1, "Select at least one source").optional(),
  sort:       z.enum(["new", "top", "hot", "controversial"], {}),
  search:     z.string().optional(),
  dateRange:  z.object({
    from:     z.string({ error: "Start date is required" }),
    to:       z.string({ error: "End date is required" }),
  })
  .refine((val) => new Date(val.from) <= new Date(val.to), {
    message: "Start date must be before end date",
    path: ["dateRange"],
  })
  .optional(),
  topics:     z.array(z.string()).min(1, "Select at least one topic").optional(),
  irony:      z.string().optional(),
  emotions:   z.array(z.string()).min(1, "Select at least one emotion").optional(),
  sentiments: z.array(z.string()).min(1, "Select at lest one sentiment").optional(),
  hateSpeech: z.string().optional(),
  offensive:  z.string().optional(),
});

type QueryData = z.input<typeof querySchema>;
type QueryPayload = z.output<typeof querySchema>;

export { querySchema };
export type { QueryData, QueryPayload };
