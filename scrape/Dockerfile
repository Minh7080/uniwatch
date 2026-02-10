FROM python:3.14-slim

WORKDIR /app

COPY scrape/requirement.txt /app/scrape/requirement.txt
RUN pip install --no-cache-dir -r /app/scrape/requirement.txt

COPY subreddits.json /app/
COPY scrape/ /app/scrape/
COPY scrape/certs/global-bundle.pem /certs/global-bundle.pem
ENV DB_SSLROOTCERT=/certs/global-bundle.pem

WORKDIR /app/scrape

CMD ["python", "src/main.py"]
