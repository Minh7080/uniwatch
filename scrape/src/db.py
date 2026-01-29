import json
import os
import threading
from datetime import datetime
from typing import TypedDict

import psycopg2
from dotenv import load_dotenv, find_dotenv
from post_score import calculate_controversial_score, calculate_hot_score

load_dotenv(find_dotenv())

_db_lock = threading.RLock()

class SubredditEntry(TypedDict):
    id: str
    name: str
    subreddit_url: str
    image_url: str

class PostEntry(TypedDict, total=False):
    id: str
    subreddit_id: str
    subreddit_name: str
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
    topics: list[str]

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
    with _db_lock:
        cursor.execute('SELECT id FROM subreddits WHERE name = %s', (subreddit_name,))
        result = cursor.fetchone()

        if result:
            return result[0]

        subreddit_id = subreddit_name
        subreddit_url = f'https://www.reddit.com/r/{subreddit_name}/'
        image_url = ''
        try:
            cursor.execute(
                'INSERT INTO subreddits (id, name, subreddit_url, image_url) VALUES (%s, %s, %s, %s) ON CONFLICT (id) DO NOTHING',
                (subreddit_id, subreddit_name, subreddit_url, image_url),
            )
            connection.commit()
            return subreddit_id
        except Exception as e:
            print(f'Error creating subreddit {subreddit_name}: {e}')
            connection.rollback()
            return None


def insert_subreddit(subreddit_entry: SubredditEntry) -> None:
    """Insert or update a subreddit entry (e.g. from Reddit API)."""
    with _db_lock:
        try:
            cursor.execute(
                '''
                INSERT INTO subreddits (id, name, subreddit_url, image_url)
                VALUES (%(id)s, %(name)s, %(subreddit_url)s, %(image_url)s)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    subreddit_url = EXCLUDED.subreddit_url,
                    image_url = EXCLUDED.image_url
                ''',
                subreddit_entry,
            )
            connection.commit()
        except Exception as e:
            print(f"Error inserting subreddit {subreddit_entry.get('name', 'unknown')}: {e}")
            connection.rollback()


def is_post_inserted(post_id: str) -> bool:
    with _db_lock:
        cursor.execute('SELECT 1 FROM posts WHERE id = %s', (post_id,))
        return cursor.fetchone() is not None


def posts_exist(post_ids: list[str]) -> set[str]:
    """Return set of post IDs that exist in the database."""
    if not post_ids:
        return set()
    with _db_lock:
        cursor.execute(
            'SELECT id FROM posts WHERE id = ANY(%s)',
            (post_ids,),
        )
        return {row[0] for row in cursor.fetchall()}


def get_post_engagement(post_id: str) -> tuple[int | None, float | None, int | None] | None:
    """Get current score, upvote_ratio, and num_comments for a post. Returns None if not found."""
    with _db_lock:
        cursor.execute(
            'SELECT score, upvote_ratio, num_comments FROM posts WHERE id = %s',
            (post_id,)
        )
        row = cursor.fetchone()
        if row is None:
            return None
        return (row[0], row[1], row[2])


def get_posts_engagement(
    post_ids: list[str],
) -> dict[str, tuple[int | None, float | None, int | None, datetime | None]]:
    """Get score, upvote_ratio, num_comments, created_utc for each post. Missing posts are omitted."""
    if not post_ids:
        return {}
    with _db_lock:
        cursor.execute(
            'SELECT id, score, upvote_ratio, num_comments, created_utc FROM posts WHERE id = ANY(%s)',
            (post_ids,),
        )
        return {
            row[0]: (row[1], row[2], row[3], row[4])
            for row in cursor.fetchall()
        }


def update_post_engagement(
    post_id: str,
    score: int,
    upvote_ratio: float,
    num_comments: int,
) -> None:
    """Update score, upvote_ratio, num_comments and recalculate hot_score and controversial_score."""
    with _db_lock:
        try:
            cursor.execute('SELECT created_utc FROM posts WHERE id = %s', (post_id,))
            row = cursor.fetchone()
            if row is None:
                return
            created_utc = row[0]
            hot_score = calculate_hot_score(score or 0, created_utc)
            controversial_score = calculate_controversial_score(score or 0, upvote_ratio)
            cursor.execute('''
                UPDATE posts
                SET score = %s, upvote_ratio = %s, num_comments = %s,
                    hot_score = %s, controversial_score = %s
                WHERE id = %s
            ''', (score, upvote_ratio, num_comments, hot_score, controversial_score, post_id))
            connection.commit()
        except Exception as e:
            print(f'Error updating post {post_id}: {e}')
            connection.rollback()


def update_engagement_batch(
    updates: list[tuple[str, int, float, int, object]],
) -> None:
    """Batch update score, upvote_ratio, num_comments and derived scores. Each item is (post_id, score, upvote_ratio, num_comments, created_utc)."""
    if not updates:
        return
    with _db_lock:
        try:
            for post_id, score, upvote_ratio, num_comments, created_utc in updates:
                hot_score = calculate_hot_score(score or 0, created_utc)
                controversial_score = calculate_controversial_score(score or 0, upvote_ratio)
                cursor.execute('''
                    UPDATE posts
                    SET score = %s, upvote_ratio = %s, num_comments = %s,
                        hot_score = %s, controversial_score = %s
                    WHERE id = %s
                ''', (score, upvote_ratio, num_comments, hot_score, controversial_score, post_id))
            connection.commit()
        except Exception as e:
            print(f'Error in update_engagement_batch: {e}')
            connection.rollback()

def _prepare_post_entry(post_entry: PostEntry) -> dict:
    """Prepare a single PostEntry for DB insert (resolve subreddit, JSON, scores). Returns dict for INSERT."""
    db_entry = post_entry.copy()
    if 'subreddit_name' not in db_entry:
        raise ValueError("subreddit_name is required")
    subreddit_id = get_or_create_subreddit(db_entry['subreddit_name'])
    if subreddit_id is None:
        raise ValueError(f"Could not get or create subreddit: {db_entry['subreddit_name']}")
    db_entry['subreddit_id'] = subreddit_id  # type: ignore
    db_entry.pop('subreddit_name', None)  # type: ignore

    for key in ('media', 'secure_media', 'preview'):
        if key in db_entry and db_entry[key] is not None:
            db_entry[key] = json.dumps(db_entry[key])  # type: ignore
        else:
            db_entry[key] = None  # type: ignore

    created_datetime = None
    if 'created_utc' in db_entry and db_entry['created_utc'] is not None:
        created_datetime = datetime.fromtimestamp(db_entry['created_utc'])
        db_entry['created_utc'] = created_datetime  # type: ignore

    score = db_entry.get('score', 0) or 0
    upvote_ratio = db_entry.get('upvote_ratio')
    db_entry['hot_score'] = calculate_hot_score(score, created_datetime) if created_datetime else 0.0  # type: ignore
    db_entry['controversial_score'] = calculate_controversial_score(score, upvote_ratio) if upvote_ratio is not None else 0.0  # type: ignore
    return db_entry


def insert_post(post_entry: PostEntry) -> None:
    with _db_lock:
        try:
            db_entry = _prepare_post_entry(post_entry)
            cursor.execute('''
                INSERT INTO posts (
                    id, subreddit_id, author, title, selftext, url, permalink,
                    score, upvote_ratio, num_comments, created_utc, is_self, is_video,
                    over_18, spoiler, stickied, locked, flair_text, thumbnail,
                    media, secure_media, preview, distinguished, edited,
                    hot_score, controversial_score
                ) VALUES (
                    %(id)s, %(subreddit_id)s, %(author)s, %(title)s, %(selftext)s, %(url)s, %(permalink)s,
                    %(score)s, %(upvote_ratio)s, %(num_comments)s, %(created_utc)s, %(is_self)s, %(is_video)s,
                    %(over_18)s, %(spoiler)s, %(stickied)s, %(locked)s, %(flair_text)s, %(thumbnail)s,
                    %(media)s, %(secure_media)s, %(preview)s, %(distinguished)s, %(edited)s,
                    %(hot_score)s, %(controversial_score)s
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
                    edited = EXCLUDED.edited,
                    hot_score = EXCLUDED.hot_score,
                    controversial_score = EXCLUDED.controversial_score
            ''', db_entry)
            connection.commit()
        except Exception as e:
            print(f'Error inserting post {post_entry.get("id", "unknown")}: {e}')
            connection.rollback()


def insert_posts_batch(entries: list[PostEntry]) -> None:
    """Insert or upsert multiple posts in one transaction."""
    if not entries:
        return
    with _db_lock:
        try:
            for post_entry in entries:
                db_entry = _prepare_post_entry(post_entry)
                cursor.execute('''
                    INSERT INTO posts (
                        id, subreddit_id, author, title, selftext, url, permalink,
                        score, upvote_ratio, num_comments, created_utc, is_self, is_video,
                        over_18, spoiler, stickied, locked, flair_text, thumbnail,
                        media, secure_media, preview, distinguished, edited,
                        hot_score, controversial_score
                    ) VALUES (
                        %(id)s, %(subreddit_id)s, %(author)s, %(title)s, %(selftext)s, %(url)s, %(permalink)s,
                        %(score)s, %(upvote_ratio)s, %(num_comments)s, %(created_utc)s, %(is_self)s, %(is_video)s,
                        %(over_18)s, %(spoiler)s, %(stickied)s, %(locked)s, %(flair_text)s, %(thumbnail)s,
                        %(media)s, %(secure_media)s, %(preview)s, %(distinguished)s, %(edited)s,
                        %(hot_score)s, %(controversial_score)s
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
                        edited = EXCLUDED.edited,
                        hot_score = EXCLUDED.hot_score,
                        controversial_score = EXCLUDED.controversial_score
                ''', db_entry)
            connection.commit()
        except Exception as e:
            print(f'Error in insert_posts_batch: {e}')
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

def get_or_create_topic(topic_name: str) -> int | None:
    """Get topic id by name, or create and return it."""
    cursor.execute('SELECT id FROM topics WHERE name = %s', (topic_name,))
    row = cursor.fetchone()
    if row:
        return row[0]
    try:
        cursor.execute('INSERT INTO topics (name) VALUES (%s) ON CONFLICT (name) DO NOTHING', (topic_name,))
        connection.commit()
        cursor.execute('SELECT id FROM topics WHERE name = %s', (topic_name,))
        row = cursor.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f'Error creating topic {topic_name}: {e}')
        connection.rollback()
        return None


def _normalize_topics(raw: object) -> list[str]:
    """Normalize topic/topics field to a list of topic name strings."""
    if raw is None:
        return []
    if isinstance(raw, str):
        return [raw] if raw else []
    if isinstance(raw, list):
        return [t for t in raw if isinstance(t, str)]
    return []


def insert_post_data(post_data_entry: PostDataEntry) -> None:
    try:
        entry = dict(post_data_entry)
        topics_raw = entry.pop('topics', None) or entry.pop('topic', None)
        topic_names = _normalize_topics(topics_raw)

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
        ''', entry)
        connection.commit()

        if topic_names:
            cursor.execute('DELETE FROM post_data_topics WHERE post_id = %s', (entry['post_id'],))
            for topic_name in topic_names:
                topic_id = get_or_create_topic(topic_name)
                if topic_id:
                    cursor.execute(
                        'INSERT INTO post_data_topics (post_id, topic_id) VALUES (%s, %s) ON CONFLICT (post_id, topic_id) DO NOTHING',
                        (entry['post_id'], topic_id),
                    )
            connection.commit()

    except Exception as e:
        print(f"Error inserting post data {post_data_entry.get('post_id', 'unknown')}: {e}")
        connection.rollback()
