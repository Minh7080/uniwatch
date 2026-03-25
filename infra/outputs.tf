output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.main.address
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

output "public_subnet_ids" {
  description = "Public subnet IDs — use for Lambda VPC config in SAM template"
  value       = aws_subnet.public[*].id
}

output "lambda_security_group_id" {
  description = "Security group ID for Lambda — use in SAM template VpcConfig"
  value       = aws_security_group.lambda.id
}
