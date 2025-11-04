from dotenv import load_dotenv, find_dotenv
from scrape import scrape_subs
import asyncio

load_dotenv(find_dotenv())

asyncio.run(scrape_subs(['testingground4bots', 'unsw', 'usyd', 'UTS', 'UOW', 'Anu']))
