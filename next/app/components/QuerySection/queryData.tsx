import z from "zod";

const emptyToUndefined = z.string().transform(val => val === "" ? undefined : val);

const stringToBoolean = z.string().transform(val => {
  if (val === "true") return true;
  if (val === "false") return false;
  if (val === "") return undefined;
  return val;
});

const arrToUndefined = <T extends z.ZodTypeAny>(schema: T, getAllLength: () => number) =>
  z.array(schema).transform(val => val.length >= getAllLength() ? undefined : val);

export const createQuerySchema = (options: { sourcesLength: number }) =>
  z.object({
    sources: arrToUndefined(z.string(), () => options.sourcesLength).pipe(z.array(z.string()).min(1, "Select at least one source").optional()),
    sort: z.enum(["new", "top", "hot", "controversial"], {}),
    search: emptyToUndefined.pipe(z.string().optional()),
    dateRange: z.object({
      from: z.string().min(1, "Start date is required"),
      to: z.string().min(1, "End date is required"),
    })
      .refine((val) => !val.from || !val.to || new Date(val.from) <= new Date(val.to), {
        message: "Start date must be before end date",
      })
      .optional(),
    topics: z.array(z.string()).min(1, "Select at least one topic").optional(),
    irony: stringToBoolean.pipe(z.boolean().optional()),
    emotions: z.array(z.string()).min(1, "Select at least one emotion").optional(),
    sentiments: z.array(z.string()).min(1, "Select at lest one sentiment").optional(),
    hateSpeech: stringToBoolean.pipe(z.boolean().optional()),
    offensive: stringToBoolean.pipe(z.boolean().optional()),
  });

export type QueryData = z.input<ReturnType<typeof createQuerySchema>>;
export type QueryPayload = z.output<ReturnType<typeof createQuerySchema>>;
