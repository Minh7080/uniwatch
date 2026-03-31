from scrape import scrape_subs
import asyncio
from classifier import classify_posts
from pathlib import Path
import json
import schedule
import time

BASE_DIR = Path(__file__).resolve().parent
SUBREDDITS_JSON_PATH = BASE_DIR.parents[1] / 'shared/subreddits.json'

with open(SUBREDDITS_JSON_PATH, 'r', encoding='utf-8') as file:
    subreddits = json.load(file)

def job():
    print('Scraping...')
    asyncio.run(scrape_subs([s['subreddit'] for s in subreddits]))
    print('Scraping done')
    print('Classifying...')
    asyncio.run(classify_posts())
    print('Classifying done')

job()
schedule.every(1).hours.do(job)

while True:
    schedule.run_pending()
    time.sleep(60)
