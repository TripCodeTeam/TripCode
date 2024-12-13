import { PartialType } from '@nestjs/mapped-types';
import { CreateClusterDto } from './create-kubernete.dto';

export class UpdateKuberneteDto extends PartialType(CreateClusterDto) {}
