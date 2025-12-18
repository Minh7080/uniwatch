import asyncio
import tweetnlp
from db import get_unclassified_post, PostDataEntry, insert_post_data

async def load_models() -> tuple:
    return await asyncio.gather(
        asyncio.to_thread(tweetnlp.TopicClassification, multi_label=False),
        asyncio.to_thread(tweetnlp.Sentiment),
        asyncio.to_thread(tweetnlp.Irony),
        asyncio.to_thread(tweetnlp.Hate),
        asyncio.to_thread(tweetnlp.Offensive),
        asyncio.to_thread(tweetnlp.Emotion),
    )

async def classify_single_post(post: tuple, models: tuple) -> PostDataEntry:
    topic_model, sentiment_model, irony_model, hate_model, offensive_model, emotion_model = models
    text = post[3] + '\n' + post[4]
    
    results = await asyncio.gather(
        asyncio.to_thread(topic_model.topic, text),
        asyncio.to_thread(sentiment_model.sentiment, text),
        asyncio.to_thread(irony_model.irony, text),
        asyncio.to_thread(hate_model.hate, text),
        asyncio.to_thread(offensive_model.offensive, text),
        asyncio.to_thread(emotion_model.emotion, text),
    )

    topic_result = results[0]
    sentiment_result = results[1]
    irony_result = results[2]
    hate_result = results[3]
    offensive_result = results[4]
    emotion_result = results[5]

    return {
        'post_id': post[0],
        'topic': topic_result.get('label'),
        'sentiment': sentiment_result.get('label'),
        'irony': (irony_result.get('label')) == 'irony',
        'hate_speech': (hate_result.get('label')) == 'hate',
        'offensive': (offensive_result.get('label')) == 'offensive',
        'emotion': emotion_result.get('label')
    }

async def classify_posts() -> None:
    unclassified_post = get_unclassified_post()
    total = len(unclassified_post)

    if not total:
        print('No posts to classify')
        return

    print(f'Found {total} posts to classify')

    models = await load_models()

    # Process in smaller batches so you see progress and avoid huge memory spikes
    batch_size = 100
    for start in range(0, total, batch_size):
        end = min(start + batch_size, total)
        batch = unclassified_post[start:end]
        print(f'Classifying posts {start + 1}-{end} of {total}...')

        results = await asyncio.gather(
            *[classify_single_post(post, models) for post in batch]
        )

        for post in results:
            insert_post_data(post)

    print('All posts classified')
