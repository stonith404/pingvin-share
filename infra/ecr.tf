module "pingvin" {
  source               = "cloudposse/ecr/aws"
  version              = "0.40.0"
  namespace            = var.namespace
  environment          = var.stage
  image_tag_mutability = "MUTABLE"
  name                 = "pingvin"
  max_image_count      = 10
}
