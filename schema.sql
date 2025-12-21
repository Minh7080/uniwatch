CREATE TABLE raw_post (
    id TEXT PRIMARY KEY,
    subreddit TEXT NOT NULL,
    author TEXT,
    title TEXT NOT NULL,
    selftext TEXT,
    url TEXT,
    permalink TEXT,
    score INTEGER,
    upvote_ratio REAL,
    num_comments INTEGER,
    created_utc TIMESTAMP NOT NULL,
    is_self BOOLEAN,
    over_18 BOOLEAN,
    spoiler BOOLEAN,
    stickied BOOLEAN,
    locked BOOLEAN,
    flair_text TEXT,
    thumbnail TEXT,
    media_url TEXT,
    distinguished TEXT,
    edited BOOLEAN,
    retrieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE classified_post_data (
    post_id TEXT PRIMARY KEY,
    topic TEXT,
    sentiment TEXT,
    irony BOOLEAN,
    hate_speech BOOLEAN,
    offensive BOOLEAN,
    emotion TEXT,
    classified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(post_id) REFERENCES raw_post(id) ON DELETE CASCADE
);

CREATE INDEX idx_raw_post_subreddit_created_utc_id
ON raw_post (subreddit, created_utc desc, id desc);
