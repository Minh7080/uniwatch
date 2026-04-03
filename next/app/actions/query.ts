"use server"
import { db } from "@/utils/db";
import { sql } from "kysely";
import { QueryPayload } from "../components/QuerySection/Sidebar/queryData";

export async function query(data: QueryPayload, cursor: string | null, limit: number = 50) {
  try {
    let statement = db
      .selectFrom("posts")
      .innerJoin("subreddits", "posts.subreddit_id", "subreddits.id")
      .leftJoin("post_data", "posts.id", "post_data.post_id")
      .leftJoin("post_data_topics", "posts.id", "post_data_topics.post_id")
      .leftJoin("topics", "post_data_topics.topic_id", "topics.id")
      .select([
        "posts.id as post_id",
        "posts.subreddit_id",
        "posts.author",
        "posts.title",
        "posts.selftext",
        "posts.url",
        "posts.permalink",
        "posts.score",
        "posts.upvote_ratio",
        "posts.num_comments",
        "posts.created_utc",
        "posts.is_self",
        "posts.is_video",
        "posts.over_18",
        "posts.spoiler",
        "posts.stickied",
        "posts.locked",
        "posts.flair_text",
        "posts.thumbnail",
        "posts.media",
        "posts.secure_media",
        "posts.preview",
        "posts.media_metadata",
        "posts.gallery_data",
        "posts.distinguished",
        "posts.edited",
        "posts.retrieved_at",
        "posts.hot_score",
        "posts.controversial_score",
        "subreddits.name as subreddit_name",
        "subreddits.subreddit_url",
        "subreddits.image_url as subreddit_image_url",
        "post_data.sentiment",
        "post_data.irony",
        "post_data.hate_speech",
        "post_data.offensive",
        "post_data.emotion",
        "post_data.classified_at",
        sql<string[]>`ARRAY_AGG(DISTINCT topics.name) FILTER (WHERE topics.name IS NOT NULL)`.as(
          "topics",
        ),
      ])
      .groupBy(["posts.id", "subreddits.id", "post_data.post_id"]);

    if (data.sources && data.sources.length > 0) {
      statement = statement.where("posts.subreddit_id", "in", data.sources);
    }

    if (data.dateRange) {
      statement = statement
        .where("posts.created_utc", ">=", new Date(data.dateRange.from))
        .where("posts.created_utc", "<=", new Date(data.dateRange.to));
    }

    if (data.topics && data.topics.length > 0) {
      statement = statement.having(
        sql<boolean>`BOOL_OR(topics.name IN (${sql.join(
          data.topics.map((topic) => sql`${topic}`),
        )}))`,
      );
    }

    if (data.search) {
      const search = `%${data.search}%`;
      statement = statement.where((eb) =>
        eb.or([
          eb("posts.title", "ilike", search),
          eb("posts.selftext", "ilike", search),
        ]),
      );
    }

    if (data.emotions && data.emotions.length > 0) {
      statement = statement.where("post_data.emotion", "in", data.emotions);
    }

    if (data.sentiments && data.sentiments.length > 0) {
      statement = statement.where("post_data.sentiment", "in", data.sentiments);
    }

    if (data.irony !== undefined) {
      statement = statement.where("post_data.irony", "=", data.irony);
    }

    if (data.hateSpeech !== undefined) {
      statement = statement.where("post_data.hate_speech", "=", data.hateSpeech);
    }

    if (data.offensive !== undefined) {
      statement = statement.where("post_data.offensive", "=", data.offensive);
    }

    switch (data.sort) {
      case "new":
        statement = statement.orderBy("posts.created_utc", "desc").orderBy("posts.id", "desc");
        break;
      case "top":
        statement = statement.orderBy("posts.score", "desc").orderBy("posts.id", "desc");
        break;
      case "hot":
        statement = statement.orderBy("posts.hot_score", "desc").orderBy("posts.id", "desc");
        break;
      case "controversial":
        statement = statement.orderBy("posts.controversial_score", "desc").orderBy("posts.id", "desc");
        break;
    }

    if (cursor) {
      const c: { sortValue: unknown; postId: string } = JSON.parse(
        Buffer.from(cursor, "base64url").toString("utf8"),
      );
      switch (data.sort) {
        case "new":
          statement = statement.where(
            sql<boolean>`(posts.created_utc, posts.id) < (${new Date(c.sortValue as string)}, ${c.postId})`,
          );
          break;
        case "top":
          statement = statement.where(
            sql<boolean>`(posts.score, posts.id) < (${c.sortValue}, ${c.postId})`,
          );
          break;
        case "hot":
          statement = statement.where(
            sql<boolean>`(posts.hot_score, posts.id) < (${c.sortValue}, ${c.postId})`,
          );
          break;
        case "controversial":
          statement = statement.where(
            sql<boolean>`(posts.controversial_score, posts.id) < (${c.sortValue}, ${c.postId})`,
          );
          break;
      }
    }

    const rows = await statement.limit(limit + 1).execute();

    let nextCursor: string | null = null;
    if (rows.length > limit) {
      rows.splice(limit);
      const last = rows[limit - 1];
      const sortValue =
        data.sort === "new" ? last.created_utc
        : data.sort === "top" ? last.score
        : data.sort === "hot" ? last.hot_score
        : last.controversial_score;
      nextCursor = Buffer.from(
        JSON.stringify({ sortValue, postId: last.post_id }),
      ).toString("base64url");
    }

    return [{ data: rows, nextCursor }, null];
  } catch (err) {
    console.error("query error:", err);
    const msg = err instanceof Error ? err.message : "Cannot query posts. Try again later."
    return [null, msg];
  }
};
