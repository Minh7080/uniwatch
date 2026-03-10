output "rds_endpoint" {
  description = "Aurora cluster writer endpoint"
  value       = aws_rds_cluster.main.endpoint
}

output "rds_cluster_arn" {
  description = "Aurora cluster ARN (used by RDS Data API)"
  value       = aws_rds_cluster.main.arn
}

output "db_secret_arn" {
  description = "Secrets Manager secret ARN for DB credentials (used by RDS Data API)"
  value       = aws_secretsmanager_secret.db.arn
}

output "db_name" {
  description = "Database name"
  value       = var.db_name
}

output "ecr_repository_url" {
  description = "ECR repository URL for the scraper image"
  value       = aws_ecr_repository.scraper.repository_url
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.main.name
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "private_subnet_ids" {
  description = "Private subnet IDs — use for Lambda VPC config in SAM template"
  value       = aws_subnet.private[*].id
}

output "lambda_security_group_id" {
  description = "Security group ID for Lambda — use in SAM template VpcConfig"
  value       = aws_security_group.lambda.id
}
