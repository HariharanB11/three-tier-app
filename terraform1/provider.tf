# Provider Configuration
provider "aws" {
  region = var.aws_region
  profile = var.aws_profile
}

# (Optional) Backend for remote state (S3 + DynamoDB)
# Uncomment if you want to use remote backend
# terraform {
#   backend "s3" {
#     bucket = "your-terraform-state-bucket"
#     key    = "three-tier/terraform.tfstate"
#     region = var.aws_region
#     dynamodb_table = "terraform-locks"
#     encrypt = true
#   }
# }
