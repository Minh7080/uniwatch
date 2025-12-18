from dotenv import load_dotenv, find_dotenv
from scrape import scrape_subs
import asyncio
from classifier import classify_posts

load_dotenv(find_dotenv())

print('Scraping...')

asyncio.run(scrape_subs([
    'UniAdelaide',
    'australiancatholicuni',
    'Anu',
    'CharlesDarwin',
    'CharlesSturtUni',
    'CQUni',
    'curtin',
    'deakin',
    'edithcowan',
    'FedUni',
    'flindersuni',
    'GriffithUni',
    'JamesCookUniversity',
    'LaTrobe',
    'MacUni',
    'murdoch', # yikes
    'QUTreddit',
    'rmit',
    'SCU', # Southern Cross University
    'swinburne',
    'TorrensUni',
    'universityofcanberra',
    'unimelb',
    'UNEAustralia',
    'unsw', 
    'UoNau',
    'UQreddit',
    'UniversityofSA',
    'UniSQ',
    'usyd', 
    'UTAS',
    'UTS', 
    'UniSC',
    'uwa',
    'vicuni',
    'UOW', 
    'UWS',
]))

print('Scraping done')

print('Classifying')

asyncio.run(classify_posts());

print('Classifying done')
