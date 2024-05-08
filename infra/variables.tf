variable "namespace" {
    type = string
}

variable "stage" {
    type = string
}

variable "name" {
    type = string
}

variable "region" {
    type = string
}

variable "cluster_name" {
    type = string
}

variable "vpc_id" {
    type = string
}

variable "subnet_ids" {
    type = list(string)
}

variable "url" {
    type = string
}

variable "lb_listener_arn" {
    type = string
}