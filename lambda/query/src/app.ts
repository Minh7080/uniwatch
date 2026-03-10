import { db } from './db';
import { QuerySchema } from './queryTypes';
import { sql } from 'kysely';

export const lambdaHandler = async (
  event: { body?: string | null },
): Promise<{ statusCode: number; body: string }> => {
  try {
    const body =
      typeof event.body === 'string' && event.body.length > 0
        ? JSON.parse(event.body)
        : {};

    const parsed = QuerySchema.safeParse(body);
    if (!parsed.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Body is not in the right format or is empty',
          issues: parsed.error.issues,
        }),
      };
    }

    const query = parsed.data;

    let statement = db
      .selectFrom('posts')
      .innerJoin('subreddits', 'posts.subreddit_id', 'subreddits.id')
      .leftJoin('post_data', 'posts.id', 'post_data.post_id')
      .leftJoin('post_data_topics', 'posts.id', 'post_data_topics.post_id')
      .leftJoin('topics', 'post_data_topics.topic_id', 'topics.id')
      .select([
        'posts.id as post_id',
        'posts.subreddit_id',
        'posts.author',
        'posts.title',
        'posts.selftext',
        'posts.url',
        'posts.permalink',
        'posts.score',
        'posts.upvote_ratio',
        'posts.num_comments',
        'posts.created_utc',
        'posts.is_self',
        'posts.is_video',
        'posts.over_18',
        'posts.spoiler',
        'posts.stickied',
        'posts.locked',
        'posts.flair_text',
        'posts.thumbnail',
        'posts.media',
        'posts.secure_media',
        'posts.preview',
        'posts.distinguished',
        'posts.edited',
        'posts.retrieved_at',
        'posts.hot_score',
        'posts.controversial_score',
        'subreddits.name as subreddit_name',
        'subreddits.subreddit_url',
        'subreddits.image_url as subreddit_image_url',
        'post_data.sentiment',
        'post_data.irony',
        'post_data.hate_speech',
        'post_data.offensive',
        'post_data.emotion',
        'post_data.classified_at',
        sql<string[]>`ARRAY_AGG(DISTINCT topics.name) FILTER (WHERE topics.name IS NOT NULL)`.as(
          'topics',
        ),
      ])
      .groupBy(['posts.id', 'subreddits.id', 'post_data.post_id']);

    if (query.sources && query.sources.length > 0) {
      statement = statement.where('posts.subreddit_id', 'in', query.sources);
    }

    if (query.dateRanges) {
      statement = statement
        .where('posts.created_utc', '>=', new Date(query.dateRanges.from))
        .where('posts.created_utc', '<=', new Date(query.dateRanges.to));
    }

    if (query.topic && query.topic.length > 0) {
      statement = statement.having(
        sql<boolean>`BOOL_OR(topics.name IN (${sql.join(
          query.topic.map((topic) => sql`${topic}`),
        )}))`,
      );
    }

    if (query.searchTerm) {
      const search = `%${query.searchTerm}%`;
      statement = statement.where((eb) =>
        eb.or([
          eb('posts.title', 'ilike', search),
          eb('posts.selftext', 'ilike', search),
        ]),
      );
    }

    if (query.emotion && query.emotion.length > 0) {
      statement = statement.where('post_data.emotion', 'in', query.emotion);
    }

    if (query.sentiment && query.sentiment.length > 0) {
      statement = statement.where('post_data.sentiment', 'in', query.sentiment);
    }

    if (query.irony !== undefined) {
      statement = statement.where('post_data.irony', '=', query.irony);
    }

    if (query.upvotes) {
      statement = statement
        .where('posts.score', '>=', query.upvotes.min)
        .where('posts.score', '<=', query.upvotes.max);
    }

    if (query.comments) {
      statement = statement
        .where('posts.num_comments', '>=', query.comments.min)
        .where('posts.num_comments', '<=', query.comments.max);
    }

    if (query.upvoteRatio !== undefined) {
      statement = statement.where('posts.upvote_ratio', '>=', query.upvoteRatio);
    }

    if (query.hateSpeech !== undefined) {
      statement = statement.where('post_data.hate_speech', '=', query.hateSpeech);
    }

    if (query.offensive !== undefined) {
      statement = statement.where('post_data.offensive', '=', query.offensive);
    }

    switch (query.sort) {
      case 'new':
        statement = statement.orderBy('posts.created_utc', 'desc');
        break;
      case 'top':
        statement = statement.orderBy('posts.score', 'desc');
        break;
      case 'hot':
        statement = statement.orderBy('posts.hot_score', 'desc');
        break;
      case 'controversial':
        statement = statement.orderBy('posts.controversial_score', 'desc');
        break;
    }

    const rows = await statement.limit(200).execute();

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
      }),
    };
  }
};
