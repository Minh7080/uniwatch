import psycopg2
from typing import TypedDict
import os
from datetime import datetime
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

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

connection = psycopg2.connect(
    host=os.getenv('DB_HOST', 'localhost'),
    database=os.getenv('DB_NAME', 'reddit'),
    user=os.getenv('DB_USER', 'postgres'),
    password=os.getenv('DB_PASS', ''),
    port=os.getenv('DB_PORT', '5432'),
    sslmode='verify-full',
    sslrootcert=os.getenv('DB_SSLROOTCERT')
)
cursor = connection.cursor()

def is_post_inserted(post_id: str) -> bool:
    cursor.execute('SELECT 1 FROM raw_post WHERE id = %s', (post_id,))
    return cursor.fetchone() is not None

def insert_post(post_entry: PostEntry) -> None:
    try:
        # Convert created_utc from Unix timestamp to datetime if present
        post_data = {**post_entry}
        if 'created_utc' in post_data and post_data['created_utc'] is not None:
            post_data['created_utc'] = datetime.fromtimestamp(post_data['created_utc'])
        
        cursor.execute('''
            INSERT INTO raw_post (
                id, subreddit, author, title, selftext, url, permalink,
                score, upvote_ratio, num_comments, created_utc, is_self,
                over_18, spoiler, stickied, locked, flair_text, thumbnail,
                media_url, distinguished, edited
            ) VALUES (
                %(id)s, %(subreddit)s, %(author)s, %(title)s, %(selftext)s, %(url)s, %(permalink)s,
                %(score)s, %(upvote_ratio)s, %(num_comments)s, %(created_utc)s, %(is_self)s,
                %(over_18)s, %(spoiler)s, %(stickied)s, %(locked)s, %(flair_text)s, %(thumbnail)s,
                %(media_url)s, %(distinguished)s, %(edited)s
            )
            ON CONFLICT (id) DO UPDATE SET
                subreddit = EXCLUDED.subreddit,
                author = EXCLUDED.author,
                title = EXCLUDED.title,
                selftext = EXCLUDED.selftext,
                url = EXCLUDED.url,
                permalink = EXCLUDED.permalink,
                score = EXCLUDED.score,
                upvote_ratio = EXCLUDED.upvote_ratio,
                num_comments = EXCLUDED.num_comments,
                created_utc = EXCLUDED.created_utc,
                is_self = EXCLUDED.is_self,
                over_18 = EXCLUDED.over_18,
                spoiler = EXCLUDED.spoiler,
                stickied = EXCLUDED.stickied,
                locked = EXCLUDED.locked,
                flair_text = EXCLUDED.flair_text,
                thumbnail = EXCLUDED.thumbnail,
                media_url = EXCLUDED.media_url,
                distinguished = EXCLUDED.distinguished,
                edited = EXCLUDED.edited
        ''', post_data)

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
            INSERT INTO classified_post_data (
                post_id, topic, sentiment, irony, hate_speech, offensive, emotion
            ) VALUES (
                %(post_id)s, %(topic)s, %(sentiment)s, %(irony)s, %(hate_speech)s, %(offensive)s, %(emotion)s
            )
            ON CONFLICT (post_id) DO UPDATE SET
                topic = EXCLUDED.topic,
                sentiment = EXCLUDED.sentiment,
                irony = EXCLUDED.irony,
                hate_speech = EXCLUDED.hate_speech,
                offensive = EXCLUDED.offensive,
                emotion = EXCLUDED.emotion
        ''', {**post_data_entry})
        connection.commit()

    except Exception as e:
        print(f"Error inserting post data {post_data_entry.get('post_id', 'unknown')}: {e}")
        connection.rollback()
