# AWS Settings
variable "aws_region" {
  description = "AWS region to deploy resources"
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "AWS CLI profile name"
  default     = "default"
}

# VPC Configuration
variable "vpc_cidr" {
  default = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  default = "10.0.1.0/24"
}

variable "app_subnet_cidr" {
  default = "10.0.2.0/24"
}

variable "db_subnet_cidr_2" {
  default = "10.0.4.0/24"
}

variable "db_subnet_cidr" {
  default = "10.0.3.0/24"
}

# EC2 Instances
variable "ec2_instance_type" {
  default = "t2.micro"
}

variable "ec2_key_name" {
  description = "Name of the existing AWS key pair to use for EC2 instances"
  default     = "jenkins"
}

# RDS Configuration
variable "db_name" {
  default = "mydb"
}

variable "db_username" {
  default = "admin"
}

variable "db_password" {
  default = "Password123!"
}

variable "db_instance_class" {
  default = "db.t3.micro"
}
