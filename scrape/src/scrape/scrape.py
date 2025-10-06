import asyncpraw
from typing import List
import asyncio
import os

async def scrape_subs(subs: List[str]):
    async with asyncpraw.Reddit(
        client_id=os.getenv('REDDIT_ID'),
        client_secret=os.getenv('REDDIT_SECRET'),
        user_agent='my user agent'
    ) as reddit:
        tasks = [poll_subreddit(sub, reddit) for sub in subs]
        await asyncio.gather(*tasks)


async def poll_subreddit(subreddit_name: str, reddit: asyncpraw.Reddit):
    sub = await reddit.subreddit(subreddit_name)
    async for post in sub.new(limit=20):
        attributes = vars(post)
        for attr, value in attributes.items():
            print(f'{attr}: {value}')
        print('-' * 50)
