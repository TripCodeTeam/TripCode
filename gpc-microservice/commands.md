
### Crear VPC

gcloud compute networks create tripcode --project=atomic-energy-438322-m8 --description=VPC\ For\ administrate\ bussines\ software --subnet-mode=custom --mtu=1460 --bgp-routing-mode=regional --bgp-best-path-selection-mode=legacy

### Crear Subnets

gcloud compute networks subnets create internal-tripcode --project=atomic-energy-438322-m8 --description=red\ de\ apps\ internal\ of\ tripcode --range=10.0.0.0/16 --stack-type=IPV4_ONLY --network=tripcode --region=us-central1

gcloud compute networks subnets create project-clients --project=atomic-energy-438322-m8 --description=deployment\ of\ apps\ to\ customer\ production\  --range=10.1.0.0/16 --stack-type=IPV4_ONLY --network=tripcode --region=us-central1

gcloud compute networks subnets create vms-rental --project=atomic-energy-438322-m8 --description=deployment\ of\ vms\ leased\ to\ third\ party\ customers --range=10.2.0.0/16 --stack-type=IPV4_ONLY --network=tripcode --region=us-central1

### Crear un Cluster de Kubernetes

gcloud beta container --project "atomic-energy-438322-m8" clusters create-auto "environment-deployment-apps-clients" --region "us-central1" --release-channel "regular" --tier "standard" --enable-private-nodes --enable-dns-access --enable-ip-access --enable-master-authorized-networks --no-enable-google-cloud-access --network "projects/atomic-energy-438322-m8/global/networks/tripcode" --subnetwork "projects/atomic-energy-438322-m8/regions/us-central1/subnetworks/project-clients" --cluster-ipv4-cidr "/17" --services-ipv4-cidr "192.168.128.0/17" --binauthz-evaluation-mode=DISABLED --enable-dataplane-v2-flow-observability --enable-secret-manager

### Desplegar aplicacion en cluster de kubernetes

## Crear namespace
forma nativa de Kubernetes para aislar recursos dentro de un clúster.

En este caso usamos: `{clientId}.{tripcodeProjectId}`