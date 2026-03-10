# Security group for the Lambda function (needs access to Aurora)
resource "aws_security_group" "lambda" {
  name        = "uniwatch-lambda-sg"
  description = "Lambda function — outbound to RDS only"
  vpc_id      = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "uniwatch-lambda-sg" }
}

# Security group for ECS Fargate scraper tasks
resource "aws_security_group" "ecs" {
  name        = "uniwatch-ecs-sg"
  description = "ECS scraper tasks — outbound to internet (Reddit API) and RDS"
  vpc_id      = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "uniwatch-ecs-sg" }
}

# Security group for Aurora cluster
resource "aws_security_group" "rds" {
  name        = "uniwatch-rds-sg"
  description = "Aurora PostgreSQL — allow 5432 from Lambda and ECS"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "PostgreSQL from Lambda"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.lambda.id]
  }

  ingress {
    description     = "PostgreSQL from ECS scraper"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "uniwatch-rds-sg" }
}
