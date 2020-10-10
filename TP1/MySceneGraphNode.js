/**
 * GraphNode class, representing a graph node.
 */
class MySceneGraphNode {
    constructor(nodeID, childNodesID, leafs, tranfMatrix, material, texture, textureID) {
        this.nodeID = nodeID;
        this.childNodesID = childNodesID;
        this.childNodes = [];
        this.leafs = leafs;
        this.transfMatrix = tranfMatrix;
        this.material = material;
        this.textureID = textureID;
        this.texture = texture;
    }

    addChildNode(child) {
        this.childNodes.push(child);
    }
}
