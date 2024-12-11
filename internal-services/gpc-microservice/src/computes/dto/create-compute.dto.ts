export class CreateVmDto {
    projectId: string
    zone: string
    vmName: string
    machineType: string
    diskImage: string
    network: string
}

export class GetVmDto {
    projectId: string;
    zone: string;
    vmName: string;
}

export class DeleteVmDto {
    projectId: string;
    zone: string;
    vmName: string;
}

export class StartVmDto {
    projectId: string;
    zone: string;
    vmName: string;
}

export class StopVmDto {
    projectId: string;
    zone: string;
    vmName: string;
}

export class ListVmsDto {
    projectId: string;
    zone: string;
}

export class RestartVmDto {
    projectId: string;
    zone: string;
    vmName: string;
}

export class GetVmStatusDto {
    projectId: string;
    zone: string;
    vmName: string;
}

export class UpdateVmTagsDto {
    projectId: string;
    zone: string;
    vmName: string;
    tags: string[];
}

export class AssignExternalIpDto {
    projectId: string;
    zone: string;
    vmName: string;
}

export class RemoveExternalIpDto {
    projectId: string;
    zone: string;
    vmName: string;
}

export class ChangeMachineTypeDto {
    projectId: string;
    zone: string;
    vmName: string;
    newMachineType: string;
}

export class CreateImageFromVmDto {
    projectId: string;
    zone: string;
    vmName: string;
    imageName: string;
}

export class ListDisksForVmDto {
    projectId: string;
    zone: string;
    vmName: string;
}

export class AddDiskToVmDto {
    projectId: string;
    zone: string;
    vmName: string;
    diskName: string;
}

export class RemoveDiskFromVmDto {
    projectId: string;
    zone: string;
    vmName: string;
    diskName: string;
}

export class CreateNetworkDto {
    projectId: string;
    networkName: string;
}

export class ListNetworksDto {
    projectId: string;
}

export class CreateCustomImageDto {
    projectId: string;
    zone: string;
    diskName: string;
    imageName: string;
}

export class ListImagesDto {
    projectId: string;
}

export class CreateSubnetDto {
    projectId: string;
    region: string;
    networkName: string;
    subnetName: string;
    cidrBlock: string;
}

export class ListAllVMsDto {
    projectId: string;
}

export class CreateFirewallRuleDto {
    projectId: string;
    firewallName: string;
    allowedIps: string[];
    networkName: string;
}
