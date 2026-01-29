import psycopg2
from typing import TypedDict
import os
import json
from datetime import datetime

class SubredditEntry(TypedDict):
    id: str
    name: str
    subreddit_url: str
    image_url: str

class PostEntry(TypedDict, total=False):
    id: str
    subreddit_id: str  # Changed: we'll get this after inserting subreddit
    subreddit_name: str  # Add this to pass the name from API
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
    is_video: bool | None
    over_18: bool | None
    spoiler: bool | None
    stickied: bool | None
    locked: bool | None
    flair_text: str | None
    thumbnail: str | None
    media: dict | list | None
    secure_media: dict | list | None
    preview: dict | list | None
    distinguished: str | None
    edited: bool | None

class PostDataEntry(TypedDict, total=False):
    post_id: str
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

def get_or_create_subreddit(subreddit_name: str) -> str | None:
    """
    Get subreddit ID from database, or create it if it doesn't exist.
    Returns the subreddit ID.
    """
    # Try to get existing subreddit by name
    cursor.execute('SELECT id FROM subreddits WHERE name = %s', (subreddit_name,))
    result = cursor.fetchone()
    
    if result:
        return result[0]

def is_post_inserted(post_id: str) -> bool:
    cursor.execute('SELECT 1 FROM posts WHERE id = %s', (post_id,))
    return cursor.fetchone() is not None

def insert_post(post_entry: PostEntry) -> None:
    try:
        db_entry = post_entry.copy()
        
        # Get or create subreddit and get its ID
        if 'subreddit_name' not in db_entry:
            raise ValueError("subreddit_name is required")
        
        subreddit_id = get_or_create_subreddit(db_entry['subreddit_name'])
        db_entry['subreddit_id'] = subreddit_id  # type: ignore
        
        # Remove subreddit_name as it's not in the posts table
        db_entry.pop('subreddit_name', None)  # type: ignore
        
        # Convert dict fields to JSON strings for JSONB columns
        if 'media' in db_entry and db_entry['media'] is not None:
            db_entry['media'] = json.dumps(db_entry['media'])  # type: ignore
        else:
            db_entry['media'] = None  # type: ignore
            
        if 'secure_media' in db_entry and db_entry['secure_media'] is not None:
            db_entry['secure_media'] = json.dumps(db_entry['secure_media'])  # type: ignore
        else:
            db_entry['secure_media'] = None  # type: ignore
            
        if 'preview' in db_entry and db_entry['preview'] is not None:
            db_entry['preview'] = json.dumps(db_entry['preview'])  # type: ignore
        else:
            db_entry['preview'] = None  # type: ignore
        
        # Convert Unix timestamp to datetime
        if 'created_utc' in db_entry and db_entry['created_utc'] is not None:
            db_entry['created_utc'] = datetime.fromtimestamp(db_entry['created_utc'])  # type: ignore

        cursor.execute('''
            INSERT INTO posts (
                id, subreddit_id, author, title, selftext, url, permalink,
                score, upvote_ratio, num_comments, created_utc, is_self, is_video,
                over_18, spoiler, stickied, locked, flair_text, thumbnail,
                media, secure_media, preview, distinguished, edited
            ) VALUES (
                %(id)s, %(subreddit_id)s, %(author)s, %(title)s, %(selftext)s, %(url)s, %(permalink)s,
                %(score)s, %(upvote_ratio)s, %(num_comments)s, %(created_utc)s, %(is_self)s, %(is_video)s,
                %(over_18)s, %(spoiler)s, %(stickied)s, %(locked)s, %(flair_text)s, %(thumbnail)s,
                %(media)s, %(secure_media)s, %(preview)s, %(distinguished)s, %(edited)s
            )
            ON CONFLICT (id) DO UPDATE SET
                subreddit_id = EXCLUDED.subreddit_id,
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
                is_video = EXCLUDED.is_video,
                over_18 = EXCLUDED.over_18,
                spoiler = EXCLUDED.spoiler,
                stickied = EXCLUDED.stickied,
                locked = EXCLUDED.locked,
                flair_text = EXCLUDED.flair_text,
                thumbnail = EXCLUDED.thumbnail,
                media = EXCLUDED.media,
                secure_media = EXCLUDED.secure_media,
                preview = EXCLUDED.preview,
                distinguished = EXCLUDED.distinguished,
                edited = EXCLUDED.edited
        ''', db_entry)

        connection.commit()
    except Exception as e:
        print(f'Error inserting post {post_entry.get("id", "unknown")}: {e}')
        connection.rollback()

def get_unclassified_post() -> list[tuple]:
    try:
        cursor.execute('''
        SELECT * from posts r where not exists (
            select 1
            from post_data c
            where r.id = c.post_id
        )
        LIMIT 10000
        ''')
        return cursor.fetchall()
    except Exception as e:
        print(f'Error selecting post: {e}')
        return []

def insert_post_data(post_data_entry: PostDataEntry) -> None:
    try:
        cursor.execute('''
            INSERT INTO post_data (
                post_id, sentiment, irony, hate_speech, offensive, emotion
            ) VALUES (
                %(post_id)s, %(sentiment)s, %(irony)s, %(hate_speech)s, %(offensive)s, %(emotion)s
            )
            ON CONFLICT (post_id) DO UPDATE SET
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
