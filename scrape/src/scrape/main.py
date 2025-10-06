from dotenv import load_dotenv, find_dotenv
from scrape.scrape import scrape_subs
import asyncio

load_dotenv(find_dotenv())

def main():
    asyncio.run(scrape_subs(['testingground4bots', 'unsw', 'Fishdom']))
