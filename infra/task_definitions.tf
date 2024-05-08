data "template_file" "pingvin" {
  template = "${file("${path.module}/pingvin.json.tpl")}"

  vars = {
    awslogs_group           = module.label.id
    region                  = var.region
    ecr_image_uri           = module.pingvin.repository_url
  }
}

resource "aws_ecs_task_definition" "this" {
  family                   = module.label.id
  container_definitions    = "${data.template_file.pingvin.rendered}"
  execution_role_arn       = aws_iam_role.execution_role.arn
  network_mode             = "bridge"
  requires_compatibilities = ["EC2"]

  volume {
    name = "service-storage"

    efs_volume_configuration {
      file_system_id          = aws_efs_file_system.this.id
      transit_encryption      = "ENABLED"
      authorization_config {
        access_point_id = aws_efs_access_point.this.id
        # iam             = "ENABLED"
      }
    }
  }
} 