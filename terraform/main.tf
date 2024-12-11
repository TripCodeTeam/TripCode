terraform {
  required_version = ">= 0.12"
}

provider "google" {
  project     = var.project_id
  region      = var.region
  credentials = file("../credentials/atomic-energy-438322-m8-456500f4f5eb.json")
}

# VPC y Subredes
resource "google_compute_network" "vpc" {
  name                    = "tripcode-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "subnet" {
  name          = "tripcode-subnet"
  network       = google_compute_network.vpc.name
  ip_cidr_range = "10.0.0.0/16"
  region        = var.region
}

# Cloud NAT para conectividad externa
resource "google_compute_router" "nat_router" {
  name    = "tripcode-nat-router"
  region  = var.region
  network = google_compute_network.vpc.name
}

resource "google_compute_router_nat" "nat" {
  name                     = "tripcode-nat"
  router                   = google_compute_router.nat_router.name
  region                   = var.region
  nat_ip_allocate_option   = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}

# Máquinas Virtuales
resource "google_compute_instance" "vm" {
  count        = var.vm_count
  name         = "tripcode-vm-${count.index}"
  machine_type = "e2-medium"
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
    }
  }

  network_interface {
    network    = google_compute_network.vpc.name
    subnetwork = google_compute_subnetwork.subnet.name
    # Eliminado el bloque de `access_config` para evitar asignar IPs externas
  }
}

# MongoDB Multitenancy
resource "google_container_cluster" "mongodb" {
  name               = "tripcode-mongodb"
  location           = var.region
  initial_node_count = 1

  node_config {
    machine_type = "e2-medium"
    disk_size_gb = 80
  }
}

# Nodo adicional en el clúster de Kubernetes (opcional, reducido)
resource "google_container_node_pool" "mongodb_nodes" {
  name       = "tripcode-mongodb-nodes"
  cluster    = google_container_cluster.mongodb.name
  location   = var.region
  node_count = 0 # Usar solo los nodos iniciales definidos en el clúster
}
