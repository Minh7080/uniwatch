import os
import threading
from typing import TypedDict

import psycopg2

_db_lock = threading.RLock()

class SubredditEntry(TypedDict):
    id: str
    name: str
    subreddit_url: str
    image_url: str

connection = psycopg2.connect(
    host=os.environ.get('POSTGRES_HOST', 'db'),
    database=os.environ['POSTGRES_DB'],
    user=os.environ['POSTGRES_USER'],
    password=os.environ['POSTGRES_PASSWORD'],
    port=os.environ.get('DB_PORT', 5432),
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
