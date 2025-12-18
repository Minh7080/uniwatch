import asyncio
from transformers import pipeline
from db import get_unclassified_post, PostDataEntry, insert_post_data


def _load_models_sync() -> tuple:
    common_kwargs = dict(device="cpu")

    topic_model = pipeline(
        task="text-classification",
        model="cardiffnlp/tweet-topic-21-multi",
        **common_kwargs,
    )
    sentiment_model = pipeline(
        task="sentiment-analysis",
        model="cardiffnlp/twitter-roberta-base-sentiment-latest",
        **common_kwargs,
    )
    irony_model = pipeline(
        task="text-classification",
        model="cardiffnlp/twitter-roberta-base-irony",
        **common_kwargs,
    )
    hate_model = pipeline(
        task="text-classification",
        model="cardiffnlp/twitter-roberta-base-hate-latest",
        **common_kwargs,
    )
    offensive_model = pipeline(
        task="text-classification",
        model="cardiffnlp/twitter-roberta-base-offensive",
        **common_kwargs,
    )
    emotion_model = pipeline(
        task="text-classification",
        model="cardiffnlp/twitter-roberta-base-emotion",
        **common_kwargs,
    )

    return (
        topic_model,
        sentiment_model,
        irony_model,
        hate_model,
        offensive_model,
        emotion_model,
    )


async def load_models() -> tuple:
    return await asyncio.to_thread(_load_models_sync)

async def classify_single_post(post: tuple, models: tuple) -> PostDataEntry:
    topic_model, sentiment_model, irony_model, hate_model, offensive_model, emotion_model = models
    text = post[3] + '\n' + post[4]
    
    results = await asyncio.gather(
        asyncio.to_thread(topic_model, text, truncation=True, max_length=512),
        asyncio.to_thread(sentiment_model, text, truncation=True, max_length=512),
        asyncio.to_thread(irony_model, text, truncation=True, max_length=512),
        asyncio.to_thread(hate_model, text, truncation=True, max_length=512),
        asyncio.to_thread(offensive_model, text, truncation=True, max_length=512),
        asyncio.to_thread(emotion_model, text, truncation=True, max_length=512),
    )
    
    topic_result = results[0][0]
    sentiment_result = results[1][0]
    irony_result = results[2][0]
    hate_result = results[3][0]
    offensive_result = results[4][0]
    emotion_result = results[5][0]
    
    return {
        'post_id': post[0],
        'topic': topic_result['label'],
        'sentiment': sentiment_result['label'],
        'irony': irony_result['label'] == 'irony',
        'hate_speech': hate_result['label'] == 'hate',
        'offensive': offensive_result['label'] == 'offensive',
        'emotion': emotion_result['label']
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
