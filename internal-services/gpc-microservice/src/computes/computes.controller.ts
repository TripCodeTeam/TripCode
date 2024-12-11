// src/compute/compute.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ComputesService } from './computes.service';
import {
  AddDiskToVmDto,
  AssignExternalIpDto,
  ChangeMachineTypeDto,
  CreateFirewallRuleDto,
  CreateImageFromVmDto,
  CreateNetworkDto,
  CreateSubnetDto,
  CreateVmDto,
  DeleteVmDto,
  GetVmStatusDto,
  ListDisksForVmDto,
  ListNetworksDto,
  ListVmsDto,
  RemoveDiskFromVmDto,
  RemoveExternalIpDto,
  RestartVmDto,
  StartVmDto,
  StopVmDto,
  UpdateVmTagsDto

} from './dto/create-compute.dto';

import {
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

@Controller('compute')
export class ComputeController {
  constructor(private readonly computesService: ComputesService) { }

  @Post('start')
  async startVm(@Body() startVmDto: StartVmDto): Promise<string> {
    return this.computesService.startVm(startVmDto);
  }

  @Post('stop')
  async stopVm(@Body() stopVmDto: StopVmDto): Promise<string> {
    return this.computesService.stopVm(stopVmDto);
  }

  @Get('list')
  async listVMs(@Body() listVmsDto: ListVmsDto): Promise<VmEntity[]> {
    return this.computesService.listVMs(listVmsDto);
  }

  @Get('get/:projectId/:zone/:vmName')
  async getVm(
    @Param('projectId') projectId: string,
    @Param('zone') zone: string,
    @Param('vmName') vmName: string,
  ): Promise<VmEntity> {
    return this.computesService.getVm({ projectId, zone, vmName });
  }

  @Post('create')
  async createVm(@Body() createVmDto: CreateVmDto): Promise<string> {
    return this.computesService.createVm(createVmDto);
  }

  @Post('delete')
  async deleteVm(@Body() deleteVmDto: DeleteVmDto): Promise<string> {
    return this.computesService.deleteVm(deleteVmDto);
  }

  @Post('restart')
  async restartVm(@Body() restartVmDto: RestartVmDto): Promise<string> {
    return this.computesService.restartVm(restartVmDto);
  }

  @Get('status')
  async getVmStatus(@Body() vmStatusDto: GetVmStatusDto): Promise<VmStatusEntity> {
    return this.computesService.getVmStatus(vmStatusDto);
  }

  @Post('update-tags')
  async updateVmTags(@Body() updateVmTags: UpdateVmTagsDto): Promise<VmTagsEntity> {
    return this.computesService.updateVmTags(updateVmTags);
  }

  @Post('assign-external-ip')
  async assignExternalIp(@Body() assignExternalIpDto: AssignExternalIpDto): Promise<VmExternalIpEntity> {
    return this.computesService.assignExternalIp(assignExternalIpDto);
  }

  @Post('remove-external-ip')
  async removeExternalIp(@Body() removeExternalIpDto: RemoveExternalIpDto): Promise<string> {
    return this.computesService.removeExternalIp(removeExternalIpDto);
  }

  @Post('change-machine-type')
  async changeMachineType(@Body() changeMachineTypeDto: ChangeMachineTypeDto): Promise<string> {
    return this.computesService.changeMachineType(changeMachineTypeDto);
  }

  @Post('create-image-from-vm')
  async createImageFromVm(@Body() createImageFromVmDto: CreateImageFromVmDto): Promise<VmImageEntity> {
    return this.computesService.createImageFromVm(createImageFromVmDto);
  }

  @Get('list-disks')
  async listDisksForVm(@Body() listDisksForVmDto: ListDisksForVmDto): Promise<VmDiskEntity[]> {
    return this.computesService.listDisksForVm(listDisksForVmDto);
  }

  @Post('add-disk')
  async addDiskToVm(@Body() addDiskToVmDto: AddDiskToVmDto): Promise<string> {
    return this.computesService.addDiskToVm(addDiskToVmDto);
  }

  @Post('remove-disk')
  async removeDiskFromVm(@Body() removeDiskFromVmDto: RemoveDiskFromVmDto): Promise<string> {
    return this.computesService.removeDiskFromVm(removeDiskFromVmDto);
  }

  @Post('create-network')
  async createNetwork(@Body() createNetworkDto: CreateNetworkDto): Promise<NetworkEntity> {
    return this.computesService.createNetwork(createNetworkDto);
  }

  @Get('list-networks')
  async listNetworks(@Body() listNetworksDto: ListNetworksDto): Promise<NetworkEntity[]> {
    return this.computesService.listNetworks(listNetworksDto.projectId);
  }

  @Post('create-subnet')
  async createSubnet(@Body() createSubnetDto: CreateSubnetDto): Promise<SubnetEntity> {
    return this.computesService.createSubnet(createSubnetDto);
  }

  @Post('create-firewall-rule')
  async createFirewallRule(@Body() createFirewallRuleDto: CreateFirewallRuleDto): Promise<FirewallRuleEntity> {
    return this.computesService.createFirewallRule(createFirewallRuleDto);
  }
}
