export class NodePoolEntity {
    name: string;
    nodeCount: number;

    constructor(partial: Partial<NodePoolEntity>) {
        Object.assign(this, partial);
    }
}

export class ClusterEntity {
    name: string;
    location: string;
    status: string;
    nodePools: NodePoolEntity[];

    constructor(partial: Partial<ClusterEntity>) {
        Object.assign(this, partial);
    }
}

