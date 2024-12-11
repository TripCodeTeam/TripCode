# Compute Service API

Este servicio de API proporciona funcionalidades para gestionar instancias de máquinas virtuales (VM) en Google Cloud, como crear, listar, iniciar, detener, y actualizar máquinas virtuales, así como trabajar con discos, IPs externas, redes y reglas de firewall.

## Base URL

La base URL para todas las solicitudes es:
http://localhost:3001/compute

## Endpoints

### 1. **Iniciar una VM**
- **URL:** `/start`
- **Método:** `POST`
- **Descripción:** Inicia una instancia de máquina virtual.
- **Request Body:**
```json 
{
  "projectId": "your-project-id",
  "zone": "us-central1-a",
  "vmName": "your-vm-name"
}
```
- **Response:**
```json 
{
  "message": "Started VM: your-vm-name. Operation ID: operation-id"
}
```

### 2. **Detener una VM**
- **URL:** `/stop`
- **Método:** `POST`
- **Descripción:** Detiene una instancia de máquina virtual.
- **Request Body:**
```json 
{
  "projectId": "your-project-id",
  "zone": "us-central1-a",
  "vmName": "your-vm-name"
}
```

### 3. **Listar todas las VMs**
- **URL:** `/vm/list`
- **Método:** `POST`
- **Descripción:** Lista todas las máquinas virtuales en una zona específica.
- **Request Body:**
```json
{
  "projectId": "your-project-id",
  "zone": "us-central1-a"
}
```
- **Response:**
```json
[
  {
    "id": "vm-id",
    "name": "vm-name",
    "status": "RUNNING",
    "machineType": "zones/us-central1-a/machineTypes/n1-standard-1"
  },
  {
    "id": "vm-id2",
    "name": "vm-name2",
    "status": "STOPPED",
    "machineType": "zones/us-central1-a/machineTypes/n1-standard-2"
  }
]
```

### 4. **Obtener información de una VM**
- **URL:** `/vm/get`
- **Método:** `POST`
- **Descripción:** Obtiene información detallada de una máquina virtual.
Request Body:
```json
{
  "projectId": "your-project-id",
  "zone": "us-central1-a",
  "vmName": "your-vm-name"
}
```
- **Response:**
```json
{
  "name": "your-vm-name",
  "status": "RUNNING",
  "machineType": "zones/us-central1-a/machineTypes/n1-standard-1",
  "networkInterfaces": []
}
```

### 5. **Crear una nueva VM**
- **URL:** `/vm/create`
- **Método:** `POST`
- **Descripción:** Crea una nueva instancia de máquina virtual.
- **Request Body:**
```json
{
  "projectId": "your-project-id",
  "zone": "us-central1-a",
  "vmName": "new-vm-name",
  "machineType": "n1-standard-1",
  "diskImage": "projects/debian-cloud/global/images/debian-9-stretch-v20200407",
  "network": "global/networks/default"
}
```
Response:
```json
{
  "message": "VM new-vm-name is being created. Operation ID: operation-id"
}
```

### 6. **Eliminar una VM**
- **URL:** `/vm/delete`
- **Método:** `POST`
- **Descripción:** Elimina una instancia de máquina virtual.
Request Body:
```json
{
  "projectId": "your-project-id",
  "zone": "us-central1-a",
  "vmName": "your-vm-name"
}
```
Response:
```json
{
  "message": "Deleted VM: your-vm-name. Operation ID: operation-id"
}
```

### 7. **Reiniciar una VM**
- **URL:** `/vm/restart`
- **Método:** `POST`
- **Descripción:** Reinicia una instancia de máquina virtual.
- **Request Body:**
```json
{
  "projectId": "your-project-id",
  "zone": "us-central1-a",
  "vmName": "your-vm-name"
}
```
- **Response:**
```json
{
  "message": "Restarted VM: your-vm-name. Operation ID: operation-id"
}
```

### 8. **Obtener el estado de una VM**
- **URL:** `/vm/status`
- **Método:** `POST`
- **Descripción:** Obtiene el estado de una instancia de máquina virtual.
- **Request Body:**
```json
{
  "projectId": "your-project-id",
  "zone": "us-central1-a",
  "vmName": "your-vm-name"
}
```
Response:
json
{
  "id": "your-vm-name",
  "name": "your-vm-name",
  "status": "RUNNING",
  "zone": "us-central1-a",
  "machineType": "zones/us-central1-a/machineTypes/n1-standard-1"
}

### 9. **Actualizar etiquetas de una VM**
- **URL:** `/vm/tags`
- **Método:** `POST`
- **Descripción:** Actualiza las etiquetas de una instancia de máquina virtual.
- **Request Body:**
```json
{
  "projectId": "your-project-id",
  "zone": "us-central1-a",
  "vmName": "your-vm-name",
  "tags": ["tag1", "tag2"]
}
```

- **Response:**
```json
{
  "id": "your-vm-name",
  "name": "your-vm-name",
  "tags": ["tag1", "tag2"],
  "zone": "us-central1-a"
}
```

### 10. **Asignar IP externa a una VM**
- **URL:** /vm/external-ip/assign
- **Método:** POST
- **Descripción:** Asigna una IP externa a una instancia de máquina virtual.
- **Request Body:**
```json
{
  "projectId": "your-project-id",
  "zone": "us-central1-a",
  "vmName": "your-vm-name"
}
```
- **Response:**
```json
{
  "id": "your-vm-name",
  "name": "your-vm-name",
  "externalIp": "external-ip-address",
  "zone": "us-central1-a"
}
```

### 11. **Desasignar IP externa de una VM**
- **URL:** `/vm/external-ip/remove`
- **Método:** `POST`
- **Descripción:** Desasigna una IP externa de una instancia de máquina virtual.
- **Request Body:**
```json
{
  "projectId": "your-project-id",
  "zone": "us-central1-a",
  "vmName": "your-vm-name"
}
```

- **Response:**
```json
{
  "message": "Removed external IP from VM: your-vm-name. Operation ID: operation-id"
}
```

### 12. **Cambiar el tipo de máquina de una VM**
- **URL:** `/vm/machine-type`
- **Método:** `POST`
- **Descripción:** Cambia el tipo de máquina de una instancia de máquina virtual.
- **Request Body:**
```json
{
  "projectId": "your-project-id",
  "zone": "us-central1-a",
  "vmName": "your-vm-name",
  "newMachineType": "n1-standard-2"
}
```
Response:
```json
{
  "message": "Changed machine type for VM: your-vm-name to n1-standard-2. Operation ID: operation-id"
}
```

### 13. **Crear una imagen de una VM**
- **URL:** `/vm/image`
- **Método:** `POST`
- **Descripción:** Crea una imagen de la instancia de máquina virtual.
Request Body:
```json
{
  "projectId": "your-project-id",
  "zone": "us-central1-a",
  "vmName": "your-vm-name",
  "imageName": "your-image-name"
}
```
- **Response:**
```json
{
  "id": "your-vm-name",
  "name": "your-image-name",
  "imageName": "your-image-name",
  "zone": "us-central1-a"
}
```

### 14. **Listar discos de una VM**
- **URL:** `/vm/disks`
- **Método:** `POST`
- **Descripción:** Lista los discos asociados a una instancia de máquina virtual.
- **Request Body:**
```json
{
  "projectId": "your-project-id",
  "zone": "us-central1-a",
  "vmName": "your-vm-name"
}
```
- **Response:**
```json
[
  {
    "id": "disk-id",
    "name": "disk-name",
    "diskName": "disk-name",
    "zone": "us-central1-a"
  }
]
```

### 15. **Agregar un disco a una VM**
- **URL:** `/vm/disk/add`
- **Método:** `POST`
- **Descripción:** Agrega un disco a una instancia de máquina virtual.
- **Request Body:**
```json
{
  "projectId": "your-project-id",
  "zone": "us-central1-a",
  "vmName": "your-vm-name",
  "diskName": "new-disk-name"
}
```

- **Response:**
```json
{
  "message": "Disk new-disk-name added to VM: your-vm-name. Operation ID: operation-id"
}
```

### 16. **Eliminar un disco de una VM**
- **URL:** `/vm/disk/remove`
- **Método:** `POST`
- **Descripción:** Elimina un disco de una instancia de máquina virtual.
- **Request Body:**
```json
{
  "projectId": "your-project-id",
  "zone": "us-central1-a",
  "vmName": "your-vm-name",
  "diskName": "disk-name"
}
```
- **Response:**
```json
{
  "message": "Disk disk-name removed from VM: your-vm-name. Operation ID: operation-id"
}
```


### 17. **Crear una Red**
- **URL:** `/network/create`
- **Método:** `POST`
- **Descripción:** Crea una red virtual en Google Cloud.
- **Request Body:**
```json
{
  "projectId": "your-project-id",
  "networkName": "your-network-name"
}
```
- **Response:**
```json 
{
  "id": "your-network-name",
  "name": "operation-id",
  "networkName": "your-network-name"
}
```

### 18. **Listar Redes**
- **URL:** `/network/list`
- **Método:** `GET`
- **Descripción:** Lista todas las redes en el proyecto.
Query Params: `projectId` 
- **projectId:** El ID del proyecto.
- **Response:**
```json 
[
  {
    "id": "network-id",
    "name": "network-name",
    "networkName": "network-name",
    "region": "Region info"
  },
  {
    "id": "network-id2",
    "name": "network-name2",
    "networkName": "network-name2",
    "region": "Region info"
  }
]
```

### 19. **Crear una Subred**
- **URL:** `/subnet/create`
- **Método:** `POST`
- **Descripción:** Crea una subred en una red existente.
- **Request Body:**
```json 
{
  "projectId": "your-project-id",
  "region": "us-central1",
  "networkName": "your-network-name",
  "subnetName": "your-subnet-name",
  "cidrBlock": "10.0.0.0/24"
}
```
- **Response:**
```json 
{
  "id": "your-subnet-name",
  "name": "operation-id",
  "subnetName": "your-subnet-name",
  "region": "us-central1",
  "cidrBlock": "10.0.0.0/24"
}
```

### 20. **Crear una Regla de Firewall**
- **URL:** `/firewall/create`
- **Método:** `POST`
- **Descripción:** Crea una regla de firewall para permitir tráfico en una red.
- **Request Body:**
```json 
{
  "projectId": "your-project-id",
  "firewallName": "your-firewall-name",
  "allowedIps": ["0.0.0.0/0"],
  "networkName": "your-network-name"
}
```
- **Response:**
```json 
{
  "id": "your-firewall-name",
  "name": "operation-id",
  "firewallName": "your-firewall-name",
  "allowedIps": ["0.0.0.0/0"],
  "networkName": "your-network-name"
}
```