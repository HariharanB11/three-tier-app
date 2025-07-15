output "web_server_public_ip" {
  description = "Public IP of the Web Server"
  value       = aws_instance.web_server.public_ip
}

output "app_server_private_ip" {
  description = "Private IP of the App Server"
  value       = aws_instance.app_server.private_ip
}

output "db_endpoint" {
  description = "RDS Database endpoint"
  value       = aws_db_instance.db_instance.endpoint
}

output "vpc_id" {
  description = "The VPC ID"
  value       = aws_vpc.main_vpc.id
}
