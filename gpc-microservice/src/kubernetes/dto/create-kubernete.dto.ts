export class CreateClusterDto {
    projectId: string;
    region: string;
    clusterName: string;
    initialNodeCount: number;
    machineType: string;
}

export class DeleteClusterDto {
    projectId: string;
    region: string;
    clusterName: string;
}

export class ListClustersDto {
    projectId: string;
    region: string;
}

export class UpdateClusterNodeCountDto {
    projectId: string;
    region: string;
    clusterName: string;
    nodeCount: number
}

export class GetClusterDetailsDto {
    projectId: string;
    region: string;
    clusterName: string;
}

export class EnableAutoScaling {
    projectId: string;
    region: string;
    clusterName: string;
}

export class ListNodesDto {
    projectId: string;
    region: string;
    clusterName: string;
}

export class ResizeNodePoolDto {
    projectId: string;
    region: string;
    clusterName: string;
    nodePoolName: string;
    newSize: number;
}

export class UpdateMasterVersionDto {
    projectId: string;
    region: string;
    clusterName: string;
    desiredMasterVersion: string;
}

export class ListNodePoolsDto {
    projectId: string;
    region: string;
    clusterName: string;
}

export class SetNodePoolAutoscalingDto {
    projectId: string;
    region: string;
    clusterName: string;
    nodePoolName: string;
    minNodes: number;
    maxNodes: number;
}

export class GetNodePoolDetailsDto {
    projectId: string;
    region: string;
    clusterName: string;
    nodePoolName: string;
}