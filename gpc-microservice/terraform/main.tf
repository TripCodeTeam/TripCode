# variables.tf
variable "project_id" {
  description = "ID del proyecto GCP"
  type        = string
}

variable "region" {
  description = "Región de GCP"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "Zona de GCP"
  type        = string
  default     = "us-central1-a"
}

variable "vpc_name" {
  description = "Nombre de la VPC existente"
  type        = string
}

variable "subnet_name" {
  description = "Nombre de la subnet existente"
  type        = string
}

variable "app_name" {
  description = "Nombre de la aplicación"
  type        = string
}

variable "credentials_file" {
  description = "Ruta al archivo de credenciales del service account"
  type        = string
}

variable "machine_type" {
  description = "Tipo de máquina para la VM"
  type        = string
  default     = "e2-medium"
}

# main.tf
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  credentials = file(var.credentials_file)
  project     = var.project_id
  region      = var.region
  zone        = var.zone
}

# Data sources para VPC y subnet existentes
data "google_compute_network" "vpc" {
  name = var.vpc_name
}

data "google_compute_subnetwork" "subnet" {
  name   = var.subnet_name
  region = var.region
}

# VM para la aplicación
resource "google_compute_instance" "app_instance" {
  name         = var.app_name
  machine_type = var.machine_type

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
      size  = 16
    }
  }

  network_interface {
    subnetwork = data.google_compute_subnetwork.subnet.id
    access_config {
      // Ephemeral IP
    }
  }

  # Tags para firewall rules
  tags = ["app"]
}

# Output
output "instance_ip" {
  value = google_compute_instance.app_instance.network_interface[0].access_config[0].nat_ip
}