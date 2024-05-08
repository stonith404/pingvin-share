resource "aws_ecs_service" "this" {
  name            = var.name
  task_definition = aws_ecs_task_definition.this.arn
  cluster         = var.cluster_name

  load_balancer {
    target_group_arn = "${aws_lb_target_group.stellaft.arn}"
    container_name   = "pingvin"
    container_port   = "3000"
  }

  launch_type                        = "EC2"
  desired_count                      = 1
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100
}