import { Injectable } from '@nestjs/common';
import * as fs from "fs/promises"
import {
  ImagesClient,
  InstancesClient,
  NetworksClient,
  SubnetworksClient,
  FirewallsClient,
} from "@google-cloud/compute"

import {
  AddDiskToVmDto,
  AssignExternalIpDto,
  ChangeMachineTypeDto,
  CreateFirewallRuleDto,
  CreateImageFromVmDto,
  CreateNetworkDto,
  CreateServiceAccountDto,
  CreateSubnetDto,
  CreateVmDto,
  DeleteVmDto,
  GetVmDto,
  GetVmStatusDto,
  ListDisksForVmDto,
  ListVmsDto,
  RemoveDiskFromVmDto,
  RemoveExternalIpDto,
  RestartVmDto,
  StartVmDto,
  StopVmDto,
  UpdateVmTagsDto
} from './dto/create-compute.dto';

import { v2 } from "@google-cloud/iam"

import {
  CreateServiceAccountEntity,
  CreateVmEntity,
  FirewallRuleEntity,
  NetworkEntity,
  SubnetEntity,
  VmDiskEntity,
  VmEntity,
  VmExternalIpEntity,
  VmImageEntity,
  VmStatusEntity,
  VmTagsEntity
} from './entities/compute.entity';
import { HandlerCreateServiceAccount, ServiceAccountDetails } from 'handlers/auth/Create-service-account';

@Injectable()
export class ComputesService {
  private readonly instancesClient: InstancesClient;
  private readonly imagesClient: ImagesClient;
  private readonly networksClient: NetworksClient;
  private readonly subNetworksClient: SubnetworksClient
  private readonly firewallsClient: FirewallsClient
  private readonly iamClient: v2.PoliciesClient

  constructor() {
    this.instancesClient = new InstancesClient();
    this.imagesClient = new ImagesClient()
    this.networksClient = new NetworksClient();
    this.subNetworksClient = new SubnetworksClient();
    this.firewallsClient = new FirewallsClient();
    this.iamClient = new v2.PoliciesClient();
  }

  /**
   * Detiene una instancia específica.
   * @param projectId ID del proyecto
   * @param zone Zona de la instancia
   * @param vmName Nombre de la instancia
   * @returns Mensaje confirmando que la instancia fue detenida
   */
  async startVm(startVmDto: StartVmDto): Promise<string> {
    const { projectId, zone, vmName } = startVmDto;
    const [response] = await this.instancesClient.start({
      project: projectId,
      zone,
      instance: vmName
    });

    // Aquí manejamos el 'response' como un LROperation
    const operationId = response.name || 'N/A'; // Si no hay 'name', mostramos 'N/A'

    return `Started VM: ${vmName}. Operation ID: ${operationId}`;
  }

  /**
 * Detiene una instancia específica.
 * @param projectId ID del proyecto
 * @param zone Zona de la instancia
 * @param vmName Nombre de la instancia
 * @returns Mensaje confirmando que la instancia fue detenida
 */
  async stopVm(stopVmDto: StopVmDto): Promise<string> {
    const { projectId, zone, vmName } = stopVmDto;
    const [response] = await this.instancesClient.stop({
      project: projectId,
      zone,
      instance: vmName,
    });

    return `Stopped VM: ${vmName}. Operation ID: ${response.name}`;
  }

  /**
   * Lista todas las instancias en una zona específica.
   * @param projectId ID del proyecto
   * @param zone Zona de las instancias
   * @returns Lista de instancias en la zona
   */
  async listVMs(listVmsDto: ListVmsDto): Promise<VmEntity[]> {
    const { projectId, zone } = listVmsDto;
    const [response] = await this.instancesClient.list({
      project: projectId,
      zone
    });
    return response.map(item => new VmEntity({
      ...item,
      id: item.id.toString(),
    }));
  }

  /**
 * Obtiene información detallada de una instancia específica.
 * @param getVmDto DTO con los datos necesarios para obtener la información de la VM
 * @returns Información de la instancia
 */
  async getVm(getVmDto: GetVmDto): Promise<VmEntity> {
    const { projectId, zone, vmName } = getVmDto;
    const [response] = await this.instancesClient.get({
      project: projectId,
      zone,
      instance: vmName,
    });
    return new VmEntity({
      name: response.name,
      status: response.status,
      machineType: response.machineType,
      networkInterfaces: response.networkInterfaces || [],
    });
  }

  /**
   * Crea una nueva instancia de máquina virtual.
   * @param createVmDto DTO con los datos necesarios para crear la VM
   * @returns Mensaje confirmando que la instancia fue creada
   */
  async createVm(createVmDto: CreateVmDto): Promise<CreateVmEntity> {
    const { projectId, zone, vmName, machineType, diskImage, network, subnetwork } = createVmDto;

    const config = {
      project: projectId,
      zone,
      instanceResource: {
        name: vmName,
        machineType: `zones/${zone}/machineTypes/${machineType}`,
        disks: [
          {
            boot: true,
            initializeParams: {
              sourceImage: diskImage,
            },
          },
        ],
        networkInterfaces: [
          {
            network: `projects/${projectId}/global/networks/${network}`, // vpc
            subnetwork: `projects/${projectId}/regions/${zone.split('-')[0]}/subnetworks/${subnetwork}`, // subnet vpc
            accessConfigs: [], // Sin IP externa
          },
        ],
        serviceAccount: [
          {
            email: 'default',
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
          },
        ],
        metadata: {
          items: [
            {
              key: 'startup-script',
              value: '#! /bin/bash\n echo "VM is up and running!" > /var/log/startup-script.log',
            }
          ]
        }
      },
    };

    try {
      const [operation] = await this.instancesClient.insert(config);

      const [metadata] = await operation.promise();

      const [vmDetails] = await this.instancesClient.get();
      const internalIp = vmDetails.networkInterfaces?.[0]?.networkIP || 'Not Available';

      const iapCommand = `gcloud compute ssh ${vmName} --project=${projectId} --zone=${zone} --tunnel-through-iap`;

      return {
        name: vmName,
        operationId: operation.name|| 'N/A',
        internalIp,
        subnet: subnetwork,
        zone: zone,
        commandShh: iapCommand,
        vmStatus: vmDetails.status,
        createdAt: vmDetails.creationTimestamp
      }
    } catch (error) {
      console.error('Error creating VM:', error);
      throw new Error(`Failed to create VM: ${error.message}`);
    }
  }

  /**
   * Elimina una instancia de máquina virtual.
   * @param deleteVmDto DTO con los datos necesarios para eliminar la VM
   * @returns Mensaje confirmando que la instancia fue eliminada
   */
  async deleteVm(deleteVmDto: DeleteVmDto): Promise<string> {
    const { projectId, zone, vmName } = deleteVmDto;
    const [response] = await this.instancesClient.delete({
      project: projectId,
      zone,
      instance: vmName,
    });
    return `Deleted VM: ${vmName}. Operation ID: ${response.name}`;
  }

  /**
   * Reinicia una instancia específica.
   * @param projectId ID del proyecto
   * @param zone Zona de la instancia
   * @param vmName Nombre de la instancia
   * @returns Mensaje confirmando que la instancia fue reiniciada
   */
  async restartVm(restartVmDto: RestartVmDto): Promise<string> {
    const { projectId, zone, vmName } = restartVmDto
    const [response] = await this.instancesClient.reset({
      project: projectId,
      zone,
      instance: vmName,
    });

    return `Restarted VM: ${vmName}. Operation ID: ${response.name}`;
  }

  /**
   * Obtiene el estado de una instancia específica.
   * @param projectId ID del proyecto
   * @param zone Zona de la instancia
   * @param vmName Nombre de la instancia
   * @returns El estado actual de la instancia
   */
  async getVmStatus(vmStatusEntity: GetVmStatusDto): Promise<VmStatusEntity> {
    const { projectId, zone, vmName } = vmStatusEntity;
    const [response] = await this.instancesClient.get({
      project: projectId,
      zone,
      instance: vmName,
    });

    return new VmStatusEntity({
      id: vmName,
      name: response.name,
      status: response.status,
      zone,
      machineType: response.machineType,
    });
  }

  /**
   * Actualiza las etiquetas de una instancia.
   * @param projectId ID del proyecto
   * @param zone Zona de la instancia
   * @param vmName Nombre de la instancia
   * @param tags Nuevas etiquetas
   * @returns Mensaje confirmando que las etiquetas fueron actualizadas
   */
  async updateVmTags(updateVmTags: UpdateVmTagsDto): Promise<VmTagsEntity> {
    try {
      const { projectId, zone, vmName, tags } = updateVmTags;
      const [operation] = await this.instancesClient.setTags({
        project: projectId,
        zone,
        instance: vmName,
      });

      const [result] = await operation.promise(); // Espera la operación LRO (Long Running Operation)

      return new VmTagsEntity({
        id: vmName,
        name: result.name,
        tags: tags,
        zone,
      });
    } catch (error) {
      throw new Error(`Error actualizando etiquetas de la VM: ${error.message}`);
    }
  }

  /**
   * Asigna una IP externa a una instancia de VM.
   * @param projectId ID del proyecto
   * @param zone Zona de la instancia
   * @param vmName Nombre de la instancia
   * @returns Mensaje confirmando que la IP fue asignada
   */
  async assignExternalIp(assignalExternalIp: AssignExternalIpDto): Promise<VmExternalIpEntity> {
    const { projectId, zone, vmName } = assignalExternalIp;

    try {
      const [operation] = await this.instancesClient.addAccessConfig({
        project: projectId,
        zone,
        instance: vmName,
        networkInterface: 'nic0', // interfaz por defecto
        accessConfigResource: {
          type: "ONE_TO_ONE_NAT",
          name: 'External NAT'
        }
      });

      // Esperar a que la operación de larga duración termine utilizando .promise()
      const [result] = await operation.promise();

      // Crear la entidad de la IP externa con los detalles obtenidos
      return new VmExternalIpEntity({
        id: vmName,
        name: result.name,
        externalIp: result.
          zone,
      });
    } catch (error) {
      throw new Error(`Error asignando la IP externa a la VM: ${error.message}`);
    }
  }

  /**
   * Desasigna la IP externa de una instancia de VM.
   * @param projectId ID del proyecto
   * @param zone Zona de la instancia
   * @param vmName Nombre de la instancia
   * @returns Mensaje confirmando que la IP fue desasignada
   */
  async removeExternalIp(removeExternalIp: RemoveExternalIpDto): Promise<string> {
    const { projectId, zone, vmName } = removeExternalIp;

    const [response] = await this.instancesClient.deleteAccessConfig({
      project: projectId,
      zone,
      instance: vmName,
      networkInterface: 'nic0', // interfaz por defecto
      accessConfig: 'External NAT', // El nombre de la configuración de acceso
    });

    return `Removed external IP from VM: ${vmName}. Operation ID: ${response.name}`;
  }

  /**
   * Cambia el tipo de máquina de una instancia.
   * @param projectId ID del proyecto
   * @param zone Zona de la instancia
   * @param vmName Nombre de la instancia
   * @param newMachineType Tipo de máquina nuevo
   * @returns Mensaje confirmando que el tipo de máquina fue cambiado
   */
  async changeMachineType(changeMachineType: ChangeMachineTypeDto): Promise<string> {
    const { projectId, zone, vmName, newMachineType } = changeMachineType;

    try {
      const [operation] = await this.instancesClient.setMachineType({
        project: projectId,
        zone,
        instance: vmName,
        instancesSetMachineTypeRequestResource: {
          machineType: `zones/${zone}/machineTypes/${newMachineType}`
        },
      });

      const [operationResult] = await operation.promise();

      return `Changed machine type for VM: ${vmName} to ${newMachineType}. Operation ID: ${operationResult.name}`;
    } catch (error) {
      throw new Error(`Error cambiando el tipo de máquina para la VM: ${error.message}`);
    }
  }

  /**
   * Crea una imagen de la instancia.
   * @param projectId ID del proyecto
   * @param zone Zona de la instancia
   * @param vmName Nombre de la instancia
   * @param imageName Nombre de la imagen a crear
   * @returns Mensaje confirmando que la imagen fue creada
   */
  async createImageFromVm(createImageFromVm: CreateImageFromVmDto): Promise<VmImageEntity> {
    const { projectId, zone, vmName, imageName } = createImageFromVm;

    try {
      const [response] = await this.imagesClient.insert({
        project: projectId,
        imageResource: {
          name: imageName,
          sourceDisk: `projects/${projectId}/zones/${zone}/instances/${vmName}/disks/boot`,
          description: `Image created from VM ${vmName}`,
        }
      });

      // Esperar a que la operación termine
      await response.promise();

      return new VmImageEntity({
        id: vmName,
        name: response.name,
        imageName,
        zone,
      });
    } catch (error) {
      throw new Error(`Failed to create image: ${error.message}`);
    }
  }

  /**
   * Obtiene los discos de una instancia específica.
   * @param projectId ID del proyecto
   * @param zone Zona de la instancia
   * @param vmName Nombre de la instancia
   * @returns Lista de discos asociados a la instancia
   */
  async listDisksForVm(listDiskForVm: ListDisksForVmDto): Promise<VmDiskEntity[]> {
    const { projectId, zone, vmName } = listDiskForVm;

    const [response] = await this.instancesClient.get({
      project: projectId,
      zone,
      instance: vmName,
    });

    return response.disks.map(disk => new VmDiskEntity({
      id: disk.source,
      name: disk.deviceName,
      diskName: disk.source.split('/').pop(),
      zone,
    }));
  }

  /**
   * Agrega un disco a una instancia.
   * @param projectId ID del proyecto
   * @param zone Zona de la instancia
   * @param vmName Nombre de la instancia
   * @param diskName Nombre del disco a agregar
   * @returns Mensaje confirmando que el disco fue agregado
   */
  async addDiskToVm(addDiskToVm: AddDiskToVmDto): Promise<string> {
    const { projectId, zone, vmName, diskName } = addDiskToVm;

    const [response] = await this.instancesClient.attachDisk({
      project: projectId,
      zone,
      instance: vmName,
      attachedDiskResource: {
        source: `projects/${projectId}/zones/${zone}/disks/${diskName}`,
        deviceName: diskName,
      },
    });

    return `Disk ${diskName} added to VM: ${vmName}. Operation ID: ${response.name}`;
  }

  /**
   * Elimina un disco de una instancia.
   * @param projectId ID del proyecto
   * @param zone Zona de la instancia
   * @param vmName Nombre de la instancia
   * @param diskName Nombre del disco a eliminar
   * @returns Mensaje confirmando que el disco fue eliminado
   */
  async removeDiskFromVm(removeDiskFromVm: RemoveDiskFromVmDto): Promise<string> { 
    const { projectId, zone, vmName, diskName } = removeDiskFromVm; 
    const [response] = await this.instancesClient.detachDisk({
      project: projectId,
      zone,
      instance: vmName,
      deviceName: diskName,
    });

    return `Disk ${diskName} removed from VM: ${vmName}. Operation ID: ${response.name}`;
  }

  /**
   * Crea una red virtual en Google Cloud.
   * @param projectId ID del proyecto
   * @param networkName Nombre de la red
   * @returns Mensaje confirmando que la red fue creada
   */
  async createNetwork(createNetwork: CreateNetworkDto): Promise<NetworkEntity> {
    const { projectId, networkName } = createNetwork;
    const networkConfig = {
      project: projectId,
      networkResource: {
        name: networkName,
        autoCreateSubnetworks: true,
      },
    };

    const [response] = await this.networksClient.insert(networkConfig);

    return new NetworkEntity({
      id: networkName,
      name: response.name,
      networkName,
    });
  }

  /**
   * Lista todas las redes en el proyecto.
   * @param projectId ID del proyecto
   * @returns Lista de redes en el proyecto
   */
  async listNetworks(projectId: string): Promise<NetworkEntity[]> {
    const [response] = await this.networksClient.list({ project: projectId }); 
    
    return response.map(item => new NetworkEntity({
      id: item.name,
      name: item.name,
      networkName: item.name,
      region: item.subnetworks ? "Region info" : "unknown",
    }));
  }

  /**
   * Crea una subred en una red existente.
   * @param projectId ID del proyecto
   * @param region Región donde se creará la subred
   * @param networkName Nombre de la red
   * @param subnetName Nombre de la subred
   * @param cidrBlock Bloque CIDR de la subred
   * @returns Mensaje confirmando que la subred fue creada
   */
  async createSubnet(createSubnet: CreateSubnetDto): Promise<SubnetEntity> {
    const { projectId, region, networkName, subnetName, cidrBlock } = createSubnet;

    const subnetConfig = {
      project: projectId,
      region: region,
      subnetResource: {
        name: subnetName,
        network: `global/networks/${networkName}`,
        ipCidrRange: cidrBlock,
        region: region,
      },
    };

    const [response] = await this.subNetworksClient.insert(subnetConfig);

    return new SubnetEntity({
      id: subnetName,
      name: response.name,
      subnetName,
      region,
      cidrBlock,
    });
  }

  /**
   * Crea una regla de firewall para permitir tráfico en una red.
   * @param projectId ID del proyecto
   * @param firewallName Nombre de la regla de firewall
   * @param allowedIps IPs permitidas
   * @param networkName Nombre de la red
   * @returns Mensaje confirmando que la regla fue creada
   */
  async createFirewallRule(createFirewallRule: CreateFirewallRuleDto): Promise<FirewallRuleEntity> {
    const { projectId, firewallName, allowedIps, networkName } = createFirewallRule;

    const firewallConfig = {
      project: projectId,
      firewallResource: {
        name: firewallName,
        allowed: allowedIps.map(ip => ({ IPProtocol: 'tcp', ports: ['80', '443'], sourceRanges: [ip] })),
        network: `global/networks/${networkName}`,
      },
    };

    const [response] = await this.firewallsClient.insert(firewallConfig);

    return new FirewallRuleEntity({
      id: firewallName,
      name: response.name,
      firewallName,
      allowedIps,
      networkName,
    });
  }

  async createServiceAccount(createServiceAccount: CreateServiceAccountDto): Promise<ServiceAccountDetails> {
    try {
      const account = await HandlerCreateServiceAccount(createServiceAccount);
      // console.log(account)
      return account
    } catch (error) {

    }
  }
}
