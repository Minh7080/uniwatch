resource "random_password" "db" {
  length  = 32
  special = false
}

resource "aws_db_subnet_group" "public" {
  name       = "uniwatch-public"
  subnet_ids = aws_subnet.public[*].id
  tags       = { Name = "uniwatch-db-subnet-group" }
}

resource "aws_db_instance" "main" {
  identifier        = "uniwatch"
  engine            = "postgres"
  engine_version    = "16"
  instance_class    = "db.t4g.micro"
  allocated_storage = 20

  db_name  = var.db_name
  username = var.db_username
  password = random_password.db.result

  db_subnet_group_name   = aws_db_subnet_group.public.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = true

  skip_final_snapshot = true

  tags = { Name = "uniwatch-db" }
}
