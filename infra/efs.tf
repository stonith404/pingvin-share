resource "aws_efs_file_system" "this" {
  creation_token = module.label.id
  encrypted = true

  tags = {
    Name = module.label.id
  }
}

resource "aws_efs_access_point" "this" {
  file_system_id = aws_efs_file_system.this.id
}

resource "aws_efs_mount_target" "alpha" {
  file_system_id = aws_efs_file_system.this.id
  subnet_id      = var.subnet_id
}