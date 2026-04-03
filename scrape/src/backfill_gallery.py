"""
One-off script: backfill media_metadata and gallery_data for existing posts.

Usage (from the scrape container or with the scrape env vars set):
    python backfill_gallery.py

Steps:
  1. Add the new columns to posts if they don't exist yet.
  2. Fetch all post IDs where media_metadata IS NULL.
  3. Re-fetch those posts from Reddit in batches of 100 (API limit).
  4. Update the DB with the new data.
"""

import asyncio
import json
import os

import asyncpraw
import psycopg2

BATCH_SIZE = 100  # Reddit info() accepts up to 100 fullnames at once

def serialize(obj):
    if obj is None or obj == {}:
        return None
    if isinstance(obj, dict):
        return {k: serialize(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [serialize(i) for i in obj]
    return obj


def get_connection():
    return psycopg2.connect(
        host=os.environ.get("POSTGRES_HOST", "db"),
        database=os.environ["POSTGRES_DB"],
        user=os.environ["POSTGRES_USER"],
        password=os.environ["POSTGRES_PASSWORD"],
        port=os.environ.get("DB_PORT", 5432),
    )


def migrate(conn):
    """Add the two new columns if they don't already exist."""
    with conn.cursor() as cur:
        cur.execute("""
            ALTER TABLE posts
                ADD COLUMN IF NOT EXISTS media_metadata JSONB,
                ADD COLUMN IF NOT EXISTS gallery_data    JSONB
        """)
    conn.commit()
    print("Migration done (columns added if missing).")


def get_null_post_ids(conn) -> list[str]:
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM posts WHERE media_metadata IS NULL")
        return [row[0] for row in cur.fetchall()]


def update_posts(conn, rows: list[tuple]):
    """rows: list of (media_metadata_json, gallery_data_json, post_id)"""
    with conn.cursor() as cur:
        cur.executemany(
            "UPDATE posts SET media_metadata = %s, gallery_data = %s WHERE id = %s",
            rows,
        )
    conn.commit()


async def backfill():
    conn = get_connection()

    migrate(conn)

    post_ids = get_null_post_ids(conn)
    print(f"Posts to backfill: {len(post_ids)}")

    if not post_ids:
        print("Nothing to do.")
        conn.close()
        return

    async with asyncpraw.Reddit(
        client_id=os.environ["REDDIT_ID"],
        client_secret=os.environ["REDDIT_SECRET"],
        user_agent="backfill_gallery/1.0",
    ) as reddit:
        updated = 0
        for i in range(0, len(post_ids), BATCH_SIZE):
            batch = post_ids[i : i + BATCH_SIZE]
            fullnames = [f"t3_{pid}" for pid in batch]

            rows = []
            async for post in reddit.info(fullnames=fullnames):
                mm = serialize(getattr(post, "media_metadata", None))
                gd = serialize(getattr(post, "gallery_data", None))
                rows.append((
                    json.dumps(mm) if mm else None,
                    json.dumps(gd) if gd else None,
                    post.id,
                ))

            update_posts(conn, rows)
            updated += len(rows)
            print(f"  Updated {updated}/{len(post_ids)} posts...")

    conn.close()
    print(f"Done. {updated} posts updated.")


if __name__ == "__main__":
    asyncio.run(backfill())
