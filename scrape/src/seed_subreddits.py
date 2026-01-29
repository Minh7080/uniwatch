"""
Seed subreddits table from subreddits.json using asyncpraw.
Loads subreddit names from JSON, fetches metadata from Reddit API, and inserts into DB.
"""
import asyncio
import json
import os
from pathlib import Path

from dotenv import load_dotenv, find_dotenv
import asyncpraw

from db import insert_subreddit, SubredditEntry

load_dotenv(find_dotenv())

BASE_DIR = Path(__file__).resolve().parent
# subreddits.json at project root (same as main.py)
SUBREDDITS_JSON_PATH = BASE_DIR.parents[1] / 'subreddits.json'


def subreddit_to_entry(sub) -> SubredditEntry:
    """Build SubredditEntry from asyncpraw Subreddit. Uses display_name as id; image_url from subreddit profile (icon) via API."""
    name = sub.display_name
    url = getattr(sub, 'url', None) or f'/r/{name}/'
    if url.startswith('/'):
        url = f'https://www.reddit.com{url}'
    elif not url.startswith('http'):
        url = f'https://www.reddit.com/r/{name}/'
    # Subreddit profile image: icon_img is the main icon URL (asyncpraw Subreddit typical attribute)
    icon = getattr(sub, 'icon_img', None) or ''
    community_icon = getattr(sub, 'community_icon', None) or ''
    if isinstance(icon, str) and icon.strip():
        image_url = icon.strip()
    elif isinstance(community_icon, str) and community_icon.strip():
        image_url = community_icon.strip()
    else:
        image_url = ''
    return {
        'id': name,
        'name': name,
        'subreddit_url': url,
        'image_url': image_url,
    }


async def seed_subreddits() -> None:
    with open(SUBREDDITS_JSON_PATH, 'r', encoding='utf-8') as f:
        names: list[str] = json.load(f)

    async with asyncpraw.Reddit(
        client_id=os.getenv('REDDIT_ID'),
        client_secret=os.getenv('REDDIT_SECRET'),
        user_agent='my user agent',
    ) as reddit:
        for name in names:
            try:
                # fetch=True so subreddit is fully loaded from API (including icon_img for profile image)
                sub = await reddit.subreddit(name, fetch=True)
                entry = subreddit_to_entry(sub)
                insert_subreddit(entry)
                print(f"  Added/updated: {entry['name']}")
            except Exception as e:
                print(f"  Error fetching {name}: {e}")
                continue


def main() -> None:
    if not SUBREDDITS_JSON_PATH.exists():
        print(f"Missing {SUBREDDITS_JSON_PATH}")
        return
    print("Seeding subreddits from Reddit API...")
    asyncio.run(seed_subreddits())
    print("Done.")


if __name__ == '__main__':
    main()
