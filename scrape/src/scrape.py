import asyncio
import asyncpraw
import os
from db import (
    PostEntry,
    posts_exist,
    get_posts_engagement,
    insert_posts_batch,
    update_engagement_batch,
)

def serialize_media(obj) -> dict | None | list:
    """Convert media objects to JSON-serializable format"""
    if obj is None or obj == {}:
        return None
    if isinstance(obj, dict):
        return {k: serialize_media(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [serialize_media(item) for item in obj]
    return obj

# Limit concurrent Reddit API requests to avoid rate limiting ("error with request")
REDDIT_CONCURRENCY = 3

async def scrape_subs(subs: list[str]) -> None:
    sem = asyncio.Semaphore(REDDIT_CONCURRENCY)
    async with asyncpraw.Reddit(
        client_id=os.getenv('REDDIT_ID'),
        client_secret=os.getenv('REDDIT_SECRET'),
        user_agent='my user agent'
    ) as reddit:
        async def poll_one(sub: str):
            async with sem:
                try:
                    await poll_subreddit(sub, reddit)
                except Exception as e:
                    print(f'Error scraping {sub}: {e}')
        await asyncio.gather(*[poll_one(sub) for sub in subs])

def _post_to_entry(post) -> PostEntry:
    media = serialize_media(getattr(post, 'media', None))
    secure_media = serialize_media(getattr(post, 'secure_media', None))
    preview = serialize_media(getattr(post, 'preview', None))
    return {
        'id': post.id,
        'subreddit_name': str(post.subreddit),
        'author': str(post.author) if post.author else None,
        'title': post.title,
        'selftext': post.selftext if hasattr(post, 'selftext') else None,
        'url': post.url if hasattr(post, 'url') else None,
        'permalink': post.permalink if hasattr(post, 'permalink') else None,
        'score': post.score if hasattr(post, 'score') else None,
        'upvote_ratio': post.upvote_ratio if hasattr(post, 'upvote_ratio') else None,
        'num_comments': post.num_comments if hasattr(post, 'num_comments') else None,
        'created_utc': int(post.created_utc) if hasattr(post, 'created_utc') and post.created_utc else 0,
        'is_self': post.is_self if hasattr(post, 'is_self') else None,
        'is_video': post.is_video if hasattr(post, 'is_video') else None,
        'over_18': post.over_18 if hasattr(post, 'over_18') else None,
        'spoiler': post.spoiler if hasattr(post, 'spoiler') else None,
        'stickied': post.stickied if hasattr(post, 'stickied') else None,
        'locked': post.locked if hasattr(post, 'locked') else None,
        'flair_text': post.link_flair_text if hasattr(post, 'link_flair_text') else None,
        'thumbnail': post.thumbnail if hasattr(post, 'thumbnail') else None,
        'media': media,
        'secure_media': secure_media,
        'preview': preview,
        'distinguished': str(post.distinguished) if hasattr(post, 'distinguished') and post.distinguished else None,
        'edited': bool(post.edited) if hasattr(post, 'edited') else None,
    }


async def poll_subreddit(subreddit_name: str, reddit: asyncpraw.Reddit) -> None:
    sub = await reddit.subreddit(subreddit_name)
    posts: list = []
    async for post in sub.new(limit=50):
        posts.append(post)

    if not posts:
        return

    post_ids = [p.id for p in posts]
    existing_ids, engagement = await asyncio.gather(
        asyncio.to_thread(posts_exist, post_ids),
        asyncio.to_thread(get_posts_engagement, post_ids),
    )

    to_insert: list[PostEntry] = []
    to_update: list[tuple[str, int, float, int, object]] = []  # post_id, score, ratio, comments, created_utc

    for post in posts:
        pid = post.id
        new_score = post.score if hasattr(post, 'score') else 0
        new_ratio = post.upvote_ratio if hasattr(post, 'upvote_ratio') else 0
        new_comments = post.num_comments if hasattr(post, 'num_comments') else 0

        if pid in existing_ids:
            current = engagement.get(pid)
            if current is not None:
                cur_score, cur_ratio, cur_comments, created_utc = current
                if new_score != cur_score or new_ratio != cur_ratio or new_comments != cur_comments:
                    to_update.append((pid, new_score, new_ratio, new_comments, created_utc))
            continue

        to_insert.append(_post_to_entry(post))

    if to_update:
        await asyncio.to_thread(update_engagement_batch, to_update)
        print(f"[{subreddit_name}] Updated engagement for {len(to_update)} posts")
    if to_insert:
        await asyncio.to_thread(insert_posts_batch, to_insert)
        print(f"[{subreddit_name}] Inserted {len(to_insert)} new posts")
