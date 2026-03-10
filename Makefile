AWS_REGION := ap-southeast-2

.PHONY: deploy deploy-scraper deploy-lambda init-db

## Deploy everything: scraper image to ECR + Lambda via SAM + DB schema
deploy: deploy-scraper deploy-lambda init-db

## Build + push the scraper Docker image to ECR
deploy-scraper:
	$(eval ECR_URL := $(shell tofu -chdir=infra output -raw ecr_repository_url))
	@echo "==> Logging into ECR..."
	aws ecr get-login-password --region $(AWS_REGION) | \
		docker login --username AWS --password-stdin $(ECR_URL)
	@echo "==> Building scraper image..."
	docker build -t $(ECR_URL):latest -f scrape/Dockerfile .
	@echo "==> Pushing to ECR..."
	docker push $(ECR_URL):latest

## Build + deploy the Lambda function via SAM
deploy-lambda:
	@echo "==> Building Lambda..."
	cd lambda && sam build
	@echo "==> Deploying Lambda..."
	cd lambda && sam deploy

## Apply schema.sql to Aurora via the RDS Data API (idempotent, safe to re-run)
init-db:
	@echo "==> Initialising database schema..."
	python3 scripts/init-db.py
