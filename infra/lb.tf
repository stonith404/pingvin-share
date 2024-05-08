
resource "aws_lb_target_group" "stellaft" {
  name  = module.label.id

  port        = 3000
  protocol    = "HTTP"
  vpc_id      = "${var.vpc_id}"
  target_type = "instance"

  health_check {
    protocol            = "HTTP"
    path                = "/api/health"
    healthy_threshold   = "3"
    unhealthy_threshold = "3"
    timeout             = "5"
    interval            = "30"
  }

  lifecycle {
    create_before_destroy = true
  }
}


resource "aws_lb_listener_rule" "stellaft" {
    listener_arn = var.lb_listener_arn

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.stellaft.arn
  }

  condition {
    host_header {
      values = [var.url]
    }
  }

  depends_on = [
    aws_lb_target_group.stellaft
  ]
}
