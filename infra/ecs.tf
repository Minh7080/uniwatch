resource "aws_ecr_repository" "scraper" {
  name                 = "uniwatch-scraper"
  force_delete         = true
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = { Name = "uniwatch-scraper" }
}

resource "aws_ecs_cluster" "main" {
  name = "uniwatch"
  tags = { Name = "uniwatch-cluster" }
}

resource "aws_cloudwatch_log_group" "scraper" {
  name              = "/ecs/uniwatch-scraper"
  retention_in_days = 14
}

locals {
  scraper_image = var.scraper_image != "" ? var.scraper_image : "${aws_ecr_repository.scraper.repository_url}:latest"
}

resource "aws_ecs_task_definition" "scraper" {
  family                   = "uniwatch-scraper"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 1024
  memory                   = 4096
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([{
    name      = "scraper"
    image     = local.scraper_image
    essential = true

    secrets = [
      { name = "DB_HOST", valueFrom = aws_ssm_parameter.db_host.arn },
      { name = "DB_PORT", valueFrom = aws_ssm_parameter.db_port.arn },
      { name = "DB_NAME", valueFrom = aws_ssm_parameter.db_name.arn },
      { name = "DB_USER", valueFrom = aws_ssm_parameter.db_user.arn },
      { name = "DB_PASS", valueFrom = aws_ssm_parameter.db_pass.arn },
      { name = "DB_SSLROOTCERT", valueFrom = aws_ssm_parameter.db_sslrootcert.arn },
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.scraper.name
        "awslogs-region"        = "ap-southeast-2"
        "awslogs-stream-prefix" = "scraper"
      }
    }
  }])

  tags = { Name = "uniwatch-scraper" }
}

# ─── EventBridge Scheduler ────────────────────────────────────────────────────

resource "aws_scheduler_schedule" "scraper" {
  name       = "uniwatch-scraper"
  group_name = "default"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression = var.scraper_schedule

  target {
    arn      = aws_ecs_cluster.main.arn
    role_arn = aws_iam_role.scheduler.arn

    ecs_parameters {
      task_definition_arn = aws_ecs_task_definition.scraper.arn
      launch_type         = "FARGATE"

      network_configuration {
        assign_public_ip = true
        security_groups  = [aws_security_group.ecs.id]
        subnets          = aws_subnet.public[*].id
      }
    }
  }
}
