from mongoengine import (
    Document,
    StringField,
    BooleanField,
    DateField,
    IntField,
    URLField,
    DictField,
    connect,
)
import os

connect(os.getenv("MONGO_URI"))


class Post(Document):
    id = StringField(primary_key=True)
    classified = BooleanField(default=False)

    subreddit_name = StringField(required=True)
    subreddit_id = StringField(required=True)

    author = StringField(required=True)
    createdUTC = DateField(required=True)

    title = StringField(required=True)
    contentText = StringField()
    flair = StringField()

    over_18 = BooleanField(default=False)

    downs = IntField(default=0)
    ups = IntField(default=0)
    num_comments = IntField(default=0)

    permalink = URLField(default="https://reddit.com")

    media_meta = DictField()

    meta = {
        "indexes": [
            "classified",
        ]
    }
