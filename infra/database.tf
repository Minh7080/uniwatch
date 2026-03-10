resource "random_password" "db" {
  length  = 32
  special = false
}

resource "aws_db_subnet_group" "private" {
  name       = "uniwatch-private"
  subnet_ids = aws_subnet.private[*].id
  tags       = { Name = "uniwatch-db-subnet-group" }
}

resource "aws_rds_cluster" "main" {
  cluster_identifier = "uniwatch"
  engine             = "aurora-postgresql"
  engine_version     = "16.6"
  engine_mode        = "provisioned"

  database_name   = var.db_name
  master_username = var.db_username
  master_password = random_password.db.result

  db_subnet_group_name   = aws_db_subnet_group.private.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  serverlessv2_scaling_configuration {
    min_capacity = 0.5
    max_capacity = 4
  }

  # Required for the RDS Data API (used for schema init without a bastion)
  enable_http_endpoint = true

  # Set to false in production to retain a final snapshot before deletion
  skip_final_snapshot = true

  tags = { Name = "uniwatch-aurora" }
}

# Secrets Manager secret — required by the RDS Data API
resource "aws_secretsmanager_secret" "db" {
  name                    = "uniwatch/db-credentials"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "db" {
  secret_id = aws_secretsmanager_secret.db.id
  secret_string = jsonencode({
    username = var.db_username
    password = random_password.db.result
    engine   = "aurora-postgresql"
    host     = aws_rds_cluster.main.endpoint
    port     = 5432
    dbname   = var.db_name
  })
}

resource "aws_rds_cluster_instance" "writer" {
  identifier         = "uniwatch-writer"
  cluster_identifier = aws_rds_cluster.main.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.main.engine
  engine_version     = aws_rds_cluster.main.engine_version

  db_subnet_group_name = aws_db_subnet_group.private.name
}
