output "vm_ips" {
  value = [
    for vm in google_compute_instance.vm :
    vm.network_interface[0].access_config[0].nat_ip if length(vm.network_interface[0].access_config) > 0
  ]
}

output "mongodb_cluster_name" {
  value = google_container_cluster.mongodb.name
}