"use server"
import { db } from "@/utils/db"
import { SubredditsTable } from "@/utils/dbTypes";

export async function getSubreddits(): Promise<[SubredditsTable[] | null, string | null]> {
  try {
    const subreddits = await db.selectFrom("subreddits").selectAll().execute();
    return [subreddits, null];
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Cannot get subreddits. Try again later."
    return [null, msg];
  }
}
