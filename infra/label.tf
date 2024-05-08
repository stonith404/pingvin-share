module "label" {
  source        = "cloudposse/label/terraform"
  version       = "0.8.0"
  namespace     = var.namespace
  stage         = var.stage
  name          = var.name
  delimiter     = "-"
}