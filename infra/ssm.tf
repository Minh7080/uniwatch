# SSM parameters referenced by the Lambda SAM template via {{resolve:ssm:/uniwatch/...}}

resource "aws_ssm_parameter" "db_host" {
  name  = "/uniwatch/DB_HOST"
  type  = "String"
  value = aws_rds_cluster.main.endpoint
}

resource "aws_ssm_parameter" "db_port" {
  name  = "/uniwatch/DB_PORT"
  type  = "String"
  value = "5432"
}

resource "aws_ssm_parameter" "db_name" {
  name  = "/uniwatch/DB_NAME"
  type  = "String"
  value = var.db_name
}

resource "aws_ssm_parameter" "db_user" {
  name  = "/uniwatch/DB_USER"
  type  = "String"
  value = var.db_username
}

resource "aws_ssm_parameter" "db_sslrootcert" {
  name  = "/uniwatch/DB_SSLROOTCERT"
  type  = "String"
  value = "/certs/global-bundle.pem"
}
