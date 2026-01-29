CREATE TABLE subreddits (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subreddit_url TEXT NOT NULL,
    image_url TEXT NOT NULL
);

CREATE TABLE posts (
    id TEXT PRIMARY KEY,
    subreddit_id TEXT NOT NULL REFERENCES subreddits(id),
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
    is_video BOOLEAN,
    over_18 BOOLEAN,
    spoiler BOOLEAN,
    stickied BOOLEAN,
    locked BOOLEAN,
    flair_text TEXT,
    thumbnail TEXT,
    media JSONB,
    secure_media JSONB,
    preview JSONB,
    distinguished TEXT,
    edited BOOLEAN,
    retrieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    hot_score DOUBLE PRECISION,
    rising_score DOUBLE PRECISION,
    controversial_score DOUBLE PRECISION
);

CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE post_data (
    post_id TEXT PRIMARY KEY REFERENCES posts(id) ON DELETE CASCADE,
    sentiment TEXT,
    irony BOOLEAN,
    hate_speech BOOLEAN,
    offensive BOOLEAN,
    emotion TEXT,
    classified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post_data_topics (
    post_id TEXT NOT NULL,
    topic_id INT NOT NULL,
    PRIMARY KEY (post_id, topic_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

CREATE INDEX idx_posts_subreddit_new ON posts(subreddit_id, created_utc DESC);
CREATE INDEX idx_posts_subreddit_hot ON posts(subreddit_id, hot_score DESC);
CREATE INDEX idx_posts_subreddit_top ON posts(subreddit_id, score DESC);
CREATE INDEX idx_posts_subreddit_rising ON posts(subreddit_id, rising_score DESC);
CREATE INDEX idx_posts_subreddit_controversial ON posts(subreddit_id, controversial_score DESC);

CREATE VIEW response AS
SELECT 
    posts.id AS post_id,
    posts.subreddit_id,
    posts.author,
    posts.title,
    posts.selftext,
    posts.url,
    posts.permalink,
    posts.score,
    posts.upvote_ratio,
    posts.num_comments,
    posts.created_utc,
    posts.is_self,
    posts.is_video,
    posts.over_18,
    posts.spoiler,
    posts.stickied,
    posts.locked,
    posts.flair_text,
    posts.thumbnail,
    posts.media,
    posts.secure_media,
    posts.preview,
    posts.distinguished,
    posts.edited,
    posts.retrieved_at,
    posts.hot_score,
    posts.rising_score,
    posts.controversial_score,
    subreddits.name AS subreddit_name,
    subreddits.subreddit_url,
    subreddits.image_url AS subreddit_image_url,
    post_data.sentiment,
    post_data.irony,
    post_data.hate_speech,
    post_data.offensive,
    post_data.emotion,
    post_data.classified_at,
    ARRAY_AGG(topics.name) FILTER (WHERE topics.name IS NOT NULL) AS topics
FROM posts
JOIN subreddits ON posts.subreddit_id = subreddits.id
LEFT JOIN post_data ON posts.id = post_data.post_id
LEFT JOIN post_data_topics ON posts.id = post_data_topics.post_id
LEFT JOIN topics ON post_data_topics.topic_id = topics.id
GROUP BY posts.id, subreddits.id, post_data.post_id;
