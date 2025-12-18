import asyncpraw
import os
from db import is_post_inserted, insert_post, PostEntry

async def scrape_subs(subs: list[str]) -> None:
    async with asyncpraw.Reddit(
        client_id=os.getenv('REDDIT_ID'),
        client_secret=os.getenv('REDDIT_SECRET'),
        user_agent='my user agent'
    ) as reddit:
        for sub in subs:
            try:
                await poll_subreddit(sub, reddit)
            except Exception as e:
                print(f'Error scraping {sub}: {e}')
                continue


async def poll_subreddit(subreddit_name: str, reddit: asyncpraw.Reddit) -> None:
        sub = await reddit.subreddit(subreddit_name)
        
        async for post in sub.new(limit=50):
            if is_post_inserted(post.id): 
                return
            
            post_entry: PostEntry = {
                'id': post.id,
                'subreddit': str(post.subreddit),
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
                'over_18': post.over_18 if hasattr(post, 'over_18') else None,
                'spoiler': post.spoiler if hasattr(post, 'spoiler') else None,
                'stickied': post.stickied if hasattr(post, 'stickied') else None,
                'locked': post.locked if hasattr(post, 'locked') else None,
                'flair_text': post.link_flair_text if hasattr(post, 'link_flair_text') else None,
                'thumbnail': post.thumbnail if hasattr(post, 'thumbnail') else None,
                'media_url': None,  # Reddit posts don't have direct media_url
                'distinguished': str(post.distinguished) if hasattr(post, 'distinguished') and post.distinguished else None,
                'edited': bool(post.edited) if hasattr(post, 'edited') else None,
            }
            
            insert_post(post_entry)
