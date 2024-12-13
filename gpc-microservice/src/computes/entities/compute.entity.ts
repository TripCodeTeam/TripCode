export class CreateVmEntity {
  name: string;
  operationId: string;
  internalIp: string;
  subnet: string;
  zone: string;
  commandShh: string;
  vmStatus: string;
  createdAt: string

  constructor(partial: Partial<CreateVmEntity>) {
    Object.assign(this, partial);
  }
}

export class VmEntity {
  id: string | number | Long;
  name: string;
  status: string;
  zone: string;
  machineType: string;
  networkInterfaces: any[];

  constructor(partial: Partial<VmEntity>) {
    Object.assign(this, partial);
  }
}

export class VmStatusEntity {
  id: string;
  name: string;
  status: string;
  zone: string;
  machineType: string;

  constructor(partial: Partial<VmStatusEntity>) {
    Object.assign(this, partial);
  }
}

export class VmTagsEntity {
  id: string;
  name: string;
  tags: string[];
  zone: string;

  constructor(partial: Partial<VmTagsEntity>) {
    Object.assign(this, partial);
  }
}

export class VmExternalIpEntity {
  id: string;
  name: string;
  externalIp: string;
  zone: string;

  constructor(partial: Partial<VmExternalIpEntity>) {
    Object.assign(this, partial);
  }
}

export class VmMachineTypeEntity {
  id: string;
  name: string;
  machineType: string;
  zone: string;

  constructor(partial: Partial<VmMachineTypeEntity>) {
    Object.assign(this, partial);
  }
}

export class VmImageEntity {
  id: string;
  name: string;
  imageName: string;
  zone: string;

  constructor(partial: Partial<VmImageEntity>) {
    Object.assign(this, partial);
  }
}

export class VmDiskEntity {
  id: string;
  name: string;
  diskName: string;
  zone: string;

  constructor(partial: Partial<VmDiskEntity>) {
    Object.assign(this, partial);
  }
}

export class NetworkEntity {
  id: string;
  name: string;
  networkName: string;
  region: string;

  constructor(partial: Partial<NetworkEntity>) {
    Object.assign(this, partial);
  }
}

export class SubnetEntity {
  id: string;
  name: string;
  subnetName: string;
  region: string;
  cidrBlock: string;

  constructor(partial: Partial<SubnetEntity>) {
    Object.assign(this, partial);
  }
}

export class FirewallRuleEntity {
  id: string;
  name: string;
  firewallName: string;
  allowedIps: string[];
  networkName: string;

  constructor(partial: Partial<FirewallRuleEntity>) {
    Object.assign(this, partial);
  }
}

export class CreateServiceAccountEntity {
  constructor(partial: Partial<CreateServiceAccountEntity>) {
    Object.assign(this, partial)
  }
}
