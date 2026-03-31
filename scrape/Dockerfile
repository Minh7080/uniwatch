FROM python:3.12-slim

WORKDIR /app

COPY scrape/requirement.txt /app/scrape/requirement.txt
RUN pip install --no-cache-dir -r /app/scrape/requirement.txt

COPY shared/subreddits.json /app/shared/
COPY scrape/ /app/scrape/

WORKDIR /app/scrape

CMD ["python", "-u", "src/main.py"]
