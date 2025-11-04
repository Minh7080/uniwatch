import time
import sqlite3
from typing import TypedDict

class PostEntry(TypedDict, total=False):
    id: str
    subreddit: str
    author: str | None
    title: str
    selftext: str | None
    url: str | None
    permalink: str | None
    score: int | None
    upvote_ratio: float | None
    num_comments: int | None
    created_utc: int | None
    is_self: bool | None
    over_18: bool | None
    spoiler: bool | None
    stickied: bool | None
    locked: bool | None
    flair_text: str | None
    thumbnail: str | None
    media_url: str | None
    distinguished: str | None
    edited: bool | None

connection = sqlite3.connect('../../reddit.db')
cursor = connection.cursor()

def is_post_inserted(post_id: str) -> bool:
    cursor.execute('SELECT 1 FROM raw_post WHERE ID = ?', (post_id,))
    return cursor.fetchone() is not None

def insert_post(post_entry: PostEntry):
    try:
        cursor.execute('''
            INSERT OR REPLACE INTO raw_post VALUES (
                :id, :subreddit, :author, :title, :selftext, :url, :permalink,
                :score, :upvote_ratio, :num_comments, :created_utc, :is_self,
                :over_18, :spoiler, :stickied, :locked, :flair_text, :thumbnail,
                :media_url, :distinguished, :edited, :retrieved_at
            )
        ''', {
            **post_entry,
            "retrieved_at": time.time()
        })
        connection.commit()
    except Exception as e:
        print(f'Error inserting post {post_entry.get("id", "unknown")}: {e}')
        connection.rollback()
        raise
