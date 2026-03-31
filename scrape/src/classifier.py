import asyncio
import json
import os
from openai import AsyncOpenAI
from db import get_unclassified_post, insert_post_data, PostDataEntry

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
MODEL = os.environ["OPENROUTER_MODEL"]

TOPICS = [
    "arts_&_culture", "business_&_entrepreneurs", "celebrity_&_pop_culture",
    "diaries_&_daily_life", "family", "fashion_&_style", "film_tv_&_video",
    "fitness_&_health", "food_&_dining", "gaming", "learning_&_educational",
    "music", "news_&_social_concern", "other_hobbies", "relationships",
    "science_&_technology", "sports", "travel_&_adventure", "youth_&_student_life",
]
SENTIMENTS = ["Positive", "Neutral", "Negative"]
EMOTIONS = ["joy", "optimism", "anger", "sadness"]

_SYSTEM_PROMPT = f"""You are a text classifier. Given a JSON array of Reddit posts (each with an "id", "title", and "selftext"), return a JSON array of classification objects in the same order. Each object must have:
- id: the post id
- topics: array of 1-3 labels from {json.dumps(TOPICS)}
- sentiment: one of {json.dumps(SENTIMENTS)}
- irony: boolean
- hate_speech: boolean
- offensive: boolean
- emotion: one of {json.dumps(EMOTIONS)}
Return only a valid JSON array."""

_CONCURRENCY = int(os.getenv("CLASSIFIER_CONCURRENCY", "5"))
_POSTS_PER_REQUEST = int(os.getenv("CLASSIFIER_POSTS_PER_REQUEST", "20"))


async def load_models() -> AsyncOpenAI:
    return AsyncOpenAI(
        api_key=os.environ["OPENROUTER_API"],
        base_url=OPENROUTER_BASE_URL,
    )


def _parse_result(data: dict, post_id: str) -> PostDataEntry:
    topics = data.get("topics", [])
    if isinstance(topics, str):
        topics = [topics]
    topics = [t for t in topics if t in TOPICS][:3]

    sentiment = data.get("sentiment", "Neutral")
    if sentiment not in SENTIMENTS:
        sentiment = "Neutral"

    emotion = data.get("emotion", "joy")
    if emotion not in EMOTIONS:
        emotion = "joy"

    return PostDataEntry(
        post_id=post_id,
        topics=topics,
        sentiment=sentiment,
        irony=bool(data.get("irony", False)),
        hate_speech=bool(data.get("hate_speech", False)),
        offensive=bool(data.get("offensive", False)),
        emotion=emotion,
    )


async def classify_batch(posts: list[tuple], client: AsyncOpenAI, semaphore: asyncio.Semaphore) -> list[PostDataEntry]:
    payload = [
        {"id": str(post[0]), "title": post[3] or "", "selftext": (post[4] or "")[:500]}
        for post in posts
    ]

    async with semaphore:
        response = await client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                {"role": "user", "content": json.dumps(payload)},
            ],
            temperature=0,
        )

    raw = response.choices[0].message.content or "[]"
    # strip markdown code fences if present
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[-1].rsplit("```", 1)[0].strip()

    results = json.loads(raw)
    if isinstance(results, dict) and "results" in results:
        results = results["results"]

    id_to_post = {str(post[0]): post for post in posts}
    entries = []
    for item in results:
        post_id = str(item.get("id", ""))
        if post_id in id_to_post:
            entries.append(_parse_result(item, post_id))

    return entries


async def classify_posts() -> None:
    unclassified_post = get_unclassified_post()
    total = len(unclassified_post)

    if not total:
        print('No posts to classify')
        return

    print(f'Found {total} posts to classify')
    client = await load_models()
    semaphore = asyncio.Semaphore(_CONCURRENCY)

    # Split into per-request chunks, then gather concurrently
    chunks = [unclassified_post[i:i + _POSTS_PER_REQUEST] for i in range(0, total, _POSTS_PER_REQUEST)]
    print(f'Sending {len(chunks)} requests ({_POSTS_PER_REQUEST} posts each, {_CONCURRENCY} concurrent)...')

    results = await asyncio.gather(*[classify_batch(chunk, client, semaphore) for chunk in chunks])

    for batch_entries in results:
        for entry in batch_entries:
            insert_post_data(entry)

    print('All posts classified')
