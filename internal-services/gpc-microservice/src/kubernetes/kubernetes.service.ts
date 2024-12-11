import { Injectable } from '@nestjs/common';
import container from "@google-cloud/container"
import { CreateClusterDto, DeleteClusterDto, EnableAutoScaling, GetClusterDetailsDto, GetNodePoolDetailsDto, ListClustersDto, ListNodePoolsDto, ListNodesDto, ResizeNodePoolDto, SetNodePoolAutoscalingDto, UpdateClusterNodeCountDto, UpdateMasterVersionDto } from './dto/create-kubernete.dto';
import { ClusterEntity } from './entities/kubernete.entity';

@Injectable()
export class KubernetesService {
  private readonly containerClient: any;

  constructor() {
    this.containerClient = new container.v1.ClusterManagerClient();
  }

  /**
   * Crea un nuevo clúster de Kubernetes.
   * @param createClusterDto DTO con los datos necesarios para crear el clúster
   * @returns Mensaje de confirmación
   */
  async createCluster(createClusterDto: CreateClusterDto): Promise<string> {
    const { projectId, region, clusterName, initialNodeCount, machineType } =
      createClusterDto;

    const request = {
      parent: `projects/${projectId}/locations/${region}`,
      cluster: {
        name: clusterName,
        initialNodeCount,
        nodeConfig: {
          machineType,
        },
      },
    };

    const [operation] = await this.containerClient.createCluster(request);
    return `Cluster ${clusterName} is being created. Operation ID: ${operation.name}`;
  }

  /**
   * Elimina un clúster de Kubernetes.
   * @param deleteClusterDto DTO con los datos necesarios para eliminar el clúster
   * @returns Mensaje de confirmación
   */
  async deleteCluster(deleteClusterDto: DeleteClusterDto): Promise<string> {
    const { projectId, region, clusterName } = deleteClusterDto;

    const request = {
      name: `projects/${projectId}/locations/${region}/clusters/${clusterName}`,
    };

    const [operation] = await this.containerClient.deleteCluster(request);
    return `Cluster ${clusterName} is being deleted. Operation ID: ${operation.name}`;
  }

  /**
   * Lista los clústeres en una región específica.
   * @param listClustersDto DTO con los datos necesarios para listar los clústeres
   * @returns Lista de clústeres
   */
  async listClusters(listClustersDto: ListClustersDto): Promise<ClusterEntity[]> {
    const { projectId, region } = listClustersDto;

    const request = {
      parent: `projects/${projectId}/locations/${region}`,
    };

    const [response] = await this.containerClient.listClusters(request);

    return response.clusters.map(
      (cluster) =>
        new ClusterEntity({
          name: cluster.name,
          location: cluster.location,
          status: cluster.status,
          nodePools: cluster.nodePools.map((pool) => ({
            name: pool.name,
            nodeCount: pool.initialNodeCount,
          })),
        }),
    );
  }

  /**
   * Actualiza la configuración de un clúster.
   * @param projectId ID del proyecto
   * @param region Región del clúster
   * @param clusterName Nombre del clúster
   * @param nodeCount Nuevo número de nodos
   * @returns Mensaje de confirmación
   */
  async updateClusterNodeCount(updateClusterNodeCount: UpdateClusterNodeCountDto): Promise<string> {
    const { projectId, region, clusterName, nodeCount } = updateClusterNodeCount;

    const request = {
      name: `projects/${projectId}/locations/${region}/clusters/${clusterName}`,
      update: {
        desiredNodePoolId: 'default-pool',
        desiredNodePoolAutoscaling: {
          enabled: true,
          minNodeCount: 1,
          maxNodeCount: nodeCount,
        },
      },
    };

    const [operation] = await this.containerClient.updateCluster(request);
    return `Cluster ${clusterName} is being updated with ${nodeCount} nodes. Operation ID: ${operation.name}`;
  }

  /**
   * Obtiene información detallada de un clúster.
   * @param projectId ID del proyecto
   * @param region Región del clúster
   * @param clusterName Nombre del clúster
   * @returns Detalles del clúster
   */
  async getClusterDetails(getClusterDetails: GetClusterDetailsDto): Promise<ClusterEntity> {
    const { projectId, region, clusterName } = getClusterDetails;

    const request = {
      name: `projects/${projectId}/locations/${region}/clusters/${clusterName}`,
    };

    const [cluster] = await this.containerClient.getCluster(request);

    return new ClusterEntity({
      name: cluster.name,
      location: cluster.location,
      status: cluster.status,
      nodePools: cluster.nodePools.map((pool) => ({
        name: pool.name,
        nodeCount: pool.initialNodeCount,
      })),
    });
  }

  /**
   * Habilita el autoscaling para un clúster.
   * @param projectId ID del proyecto
   * @param region Región del clúster
   * @param clusterName Nombre del clúster
   * @returns Mensaje de confirmación
   */
  async enableAutoscaling(enableAutoscaling: EnableAutoScaling): Promise<string> {
    const { projectId, region, clusterName } = enableAutoscaling;

    const request = {
      name: `projects/${projectId}/locations/${region}/clusters/${clusterName}`,
      update: {
        desiredNodePoolAutoscaling: {
          enabled: true,
          minNodeCount: 1,
          maxNodeCount: 10,
        },
      },
    };

    const [operation] = await this.containerClient.updateCluster(request);
    return `Autoscaling enabled for cluster ${clusterName}. Operation ID: ${operation.name}`;
  }

  /**
   * Lista todos los nodos en un clúster.
   * @param projectId ID del proyecto
   * @param region Región del clúster
   * @param clusterName Nombre del clúster
   * @returns Lista de nodos
   */
  async listNodes(listNodes: ListNodesDto): Promise<any[]> {
    const { projectId, region, clusterName } = listNodes;
    const clusterDetails = await this.getClusterDetails({ projectId, region, clusterName });

    return clusterDetails.nodePools.flatMap((pool) =>
      Array(pool.nodeCount).fill({ nodePoolName: pool.name, clusterName }),
    );
  }

  /**
   * Cambia el tamaño de un grupo de nodos en un clúster.
   * @param projectId ID del proyecto
   * @param region Región del clúster
   * @param clusterName Nombre del clúster
   * @param nodePoolName Nombre del grupo de nodos
   * @param newSize Nuevo tamaño del grupo de nodos
   * @returns Mensaje de confirmación
   */
  async resizeNodePool(resizeNodePool: ResizeNodePoolDto): Promise<string> {
    const { projectId, region, clusterName, nodePoolName, newSize } = resizeNodePool;

    const request = {
      name: `projects/${projectId}/locations/${region}/clusters/${clusterName}/nodePools/${nodePoolName}`,
      nodeCount: newSize,
    };

    const [operation] = await this.containerClient.setNodePoolSize(request);

    return `Node pool ${nodePoolName} in cluster ${clusterName} resized to ${newSize} nodes. Operation ID: ${operation.name}`;
  }

  /**
   * Actualiza la versión del master de Kubernetes en un clúster.
   * @param projectId ID del proyecto
   * @param region Región del clúster
   * @param clusterName Nombre del clúster
   * @param desiredMasterVersion Versión deseada para el master
   * @returns Mensaje de confirmación
   */
  async updateMasterVersion(updateMasterVersion: UpdateMasterVersionDto): Promise<string> {
    const {
      projectId,
      region,
      clusterName,
      desiredMasterVersion } = updateMasterVersion;
    const request = {
      name: `projects/${projectId}/locations/${region}/clusters/${clusterName}`,
      update: {
        desiredMasterVersion,
      },
    };

    const [operation] = await this.containerClient.updateCluster(request);
    return `Master version of cluster ${clusterName} is being updated to ${desiredMasterVersion}. Operation ID: ${operation.name}`;
  }

  /**
   * Lista todos los grupos de nodos en un clúster.
   * @param projectId ID del proyecto
   * @param region Región del clúster
   * @param clusterName Nombre del clúster
   * @returns Lista de grupos de nodos
   */
  async listNodePools(listNodePoolsDto: ListNodePoolsDto): Promise<any[]> {
    const { projectId, region, clusterName } = listNodePoolsDto;

    const request = {
      parent: `projects/${projectId}/locations/${region}/clusters/${clusterName}`,
    };

    const [response] = await this.containerClient.listNodePools(request);
    return response.nodePools || [];
  }

  /**
   * Configura el autoscaling de un grupo de nodos.
   * @param projectId ID del proyecto
   * @param region Región del clúster
   * @param clusterName Nombre del clúster
   * @param nodePoolName Nombre del grupo de nodos
   * @param minNodes Mínimo número de nodos
   * @param maxNodes Máximo número de nodos
   * @returns Mensaje de confirmación
   */
  async setNodePoolAutoscaling(setNodePoolAutoscaling: SetNodePoolAutoscalingDto): Promise<string> {
    const { projectId, region ,clusterName, nodePoolName, minNodes, maxNodes } = setNodePoolAutoscaling;

    const request = {
      name: `projects/${projectId}/locations/${region}/clusters/${clusterName}/nodePools/${nodePoolName}`,
      autoscaling: {
        enabled: true,
        minNodeCount: minNodes,
        maxNodeCount: maxNodes,
      },
    };

    const [operation] = await this.containerClient.setNodePoolAutoscaling(request);
    return `Autoscaling configured for node pool ${nodePoolName} in cluster ${clusterName}. Operation ID: ${operation.name}`;
  }

  /**
   * Obtiene los detalles de un grupo de nodos específico.
   * @param projectId ID del proyecto
   * @param region Región del clúster
   * @param clusterName Nombre del clúster
   * @param nodePoolName Nombre del grupo de nodos
   * @returns Detalles del grupo de nodos
   */
  async getNodePoolDetails(getNodePoolDetails: GetNodePoolDetailsDto): Promise<any> {
    const { projectId, region, clusterName, nodePoolName } = getNodePoolDetails;

    const request = {
      name: `projects/${projectId}/locations/${region}/clusters/${clusterName}/nodePools/${nodePoolName}`,
    };

    const [nodePool] = await this.containerClient.getNodePool(request);
    return nodePool;
  }

  

}
