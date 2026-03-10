variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "uniwatch"
}

variable "db_username" {
  description = "PostgreSQL master username"
  type        = string
  default     = "uniwatch"
}

variable "scraper_schedule" {
  description = "EventBridge schedule expression for the scraper task"
  type        = string
  default     = "rate(1 hour)"
}

variable "scraper_image" {
  description = "ECR image URI for the scraper container (e.g. 123456789.dkr.ecr.ap-southeast-2.amazonaws.com/uniwatch-scraper:latest)"
  type        = string
  default     = ""
}
