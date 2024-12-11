import { PartialType } from '@nestjs/mapped-types';
import { CreateVmDto } from './create-compute.dto';

export class UpdateComputeDto extends PartialType(CreateVmDto) {}
