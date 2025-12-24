from dotenv import load_dotenv, find_dotenv
from scrape import scrape_subs
import asyncio
from classifier import classify_posts
from pathlib import Path
import json

load_dotenv(find_dotenv())

print('Scraping...')

BASE_DIR = Path(__file__).resolve().parent
SUBREDDITS_JSON_PATH = BASE_DIR.parents[1] / 'subreddits.json'

with open(SUBREDDITS_JSON_PATH, 'r', encoding='utf-8') as file:
    subreddits = json.load(file)

asyncio.run(scrape_subs(subreddits))

print('Scraping done')

print('Classifying')

asyncio.run(classify_posts());

print('Classifying done')
