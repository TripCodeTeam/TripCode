import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KubernetesService } from './kubernetes.service';

@Controller('kubernetes')
export class KubernetesController {
  constructor(private readonly kubernetesService: KubernetesService) {}
}
