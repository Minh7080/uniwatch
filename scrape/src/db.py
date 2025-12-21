import sqlite3
from typing import TypedDict
from pathlib import Path

class PostEntry(TypedDict, total = False):
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

class PostDataEntry(TypedDict, total = False):
    post_id: str
    topic: str
    sentiment: str
    irony: bool
    hate_speech: bool
    offensive: bool
    emotion: str

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR.parents[1] / 'reddit.db'

connection = sqlite3.connect(DB_PATH)
cursor = connection.cursor()

def is_post_inserted(post_id: str) -> bool:
    cursor.execute('SELECT 1 FROM raw_post WHERE ID = ?', (post_id,))
    return cursor.fetchone() is not None

def insert_post(post_entry: PostEntry) -> None:
    try:
        cursor.execute('''
            INSERT OR REPLACE INTO raw_post (
                id, subreddit, author, title, selftext, url, permalink,
                score, upvote_ratio, num_comments, created_utc, is_self,
                over_18, spoiler, stickied, locked, flair_text, thumbnail,
                media_url, distinguished, edited
            ) VALUES (
                :id, :subreddit, :author, :title, :selftext, :url, :permalink,
                :score, :upvote_ratio, :num_comments, :created_utc, :is_self,
                :over_18, :spoiler, :stickied, :locked, :flair_text, :thumbnail,
                :media_url, :distinguished, :edited
            )
        ''', {**post_entry})

        connection.commit()
    except Exception as e:
        print(f'Error inserting post {post_entry.get('id', 'unknown')}: {e}')
        connection.rollback()

def get_unclassified_post() -> list[tuple]:
    try:
        cursor.execute('''
        SELECT * from raw_post r where not exists (
            select 1
            from classified_post_data c
            where r.id = c.post_id
        )
        LIMIT 10000
        ''')
        return cursor.fetchall()
    except Exception as e:
        print(f'Error selecting post:  {e}')
        return []

def insert_post_data(post_data_entry: PostDataEntry) -> None:
    try:
        cursor.execute('''
            INSERT OR REPLACE INTO classified_post_data (
                post_id, topic, sentiment, irony, hate_speech, offensive, emotion
            ) VALUES (
                :post_id, :topic, :sentiment, :irony, :hate_speech, :offensive, :emotion
            )
        ''', {**post_data_entry})
        connection.commit()

    except Exception as e:
        print(f"Error inserting post data {post_data_entry.get('id', 'unknown')}: {e}")
        connection.rollback()
