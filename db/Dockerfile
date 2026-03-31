FROM python:3.12-slim

WORKDIR /app

COPY db/requirement.txt /app/db/requirement.txt
RUN pip install --no-cache-dir -r /app/db/requirement.txt

COPY shared/subreddits.json /app/shared/
COPY db/ /app/db/

WORKDIR /app/db

CMD ["python", "seed_subreddits.py"]
