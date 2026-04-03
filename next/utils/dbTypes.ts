import { ColumnType, Generated } from 'kysely';

export type TimestampColumn = ColumnType<Date, Date | string, Date | string>;
export type JsonColumn = ColumnType<unknown, unknown, unknown>;

export interface SubredditsTable {
  id: string;
  name: string;
  subreddit_url: string;
  image_url: string;
};

export interface PostsTable {
  id: string;
  subreddit_id: string;
  author: string | null;
  title: string;
  selftext: string | null;
  url: string | null;
  permalink: string | null;
  score: number | null;
  upvote_ratio: number | null;
  num_comments: number | null;
  created_utc: TimestampColumn;
  is_self: boolean | null;
  is_video: boolean | null;
  over_18: boolean | null;
  spoiler: boolean | null;
  stickied: boolean | null;
  locked: boolean | null;
  flair_text: string | null;
  thumbnail: string | null;
  media: JsonColumn | null;
  secure_media: JsonColumn | null;
  preview: JsonColumn | null;
  media_metadata: JsonColumn | null;
  gallery_data: JsonColumn | null;
  distinguished: string | null;
  edited: boolean | null;
  retrieved_at: TimestampColumn;
  hot_score: number | null;
  controversial_score: number | null;
};

export interface TopicsTable {
  id: Generated<number>;
  name: string;
};

export interface PostDataTable {
  post_id: string;
  sentiment: string | null;
  irony: boolean | null;
  hate_speech: boolean | null;
  offensive: boolean | null;
  emotion: string | null;
  classified_at: TimestampColumn | null;
};

export interface PostDataTopicsTable {
  post_id: string;
  topic_id: number;
};

export interface ResponseView {
  post_id: string;
  subreddit_id: string;
  author: string | null;
  title: string;
  selftext: string | null;
  url: string | null;
  permalink: string | null;
  score: number | null;
  upvote_ratio: number | null;
  num_comments: number | null;
  created_utc: Date;
  is_self: boolean | null;
  is_video: boolean | null;
  over_18: boolean | null;
  spoiler: boolean | null;
  stickied: boolean | null;
  locked: boolean | null;
  flair_text: string | null;
  thumbnail: string | null;
  media: unknown | null;
  secure_media: unknown | null;
  preview: unknown | null;
  media_metadata: unknown | null;
  gallery_data: unknown | null;
  distinguished: string | null;
  edited: boolean | null;
  retrieved_at: Date;
  hot_score: number | null;
  controversial_score: number | null;
  subreddit_name: string;
  subreddit_url: string;
  subreddit_image_url: string;
  sentiment: string | null;
  irony: boolean | null;
  hate_speech: boolean | null;
  offensive: boolean | null;
  emotion: string | null;
  classified_at: Date | null;
  topics: string[] | null;
};

export interface Database {
  subreddits: SubredditsTable;
  posts: PostsTable;
  topics: TopicsTable;
  post_data: PostDataTable;
  post_data_topics: PostDataTopicsTable;
  response: ResponseView;
};
