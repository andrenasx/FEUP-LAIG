/**
 * GraphNode class, representing a graph node.
 */
class MySceneGraphNode {
    constructor(nodeID, childNodesID, leafs, tranfMatrix, material, texture) {
        this.nodeID = nodeID;
        this.childNodesID = childNodesID;
        this.childNodes = [];
        this.leafs = leafs;
        this.transfMatrix = tranfMatrix;
        this.material = material;
        this.texture = texture;
    }

    addChildNode(child) {
        this.childNodes.push(child);
    }
}
