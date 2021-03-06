/**
 * GraphNode class, representing a graph node.
 */
class MySceneGraphNode {
    constructor(scene, nodeID, childNodesID, leafs, tranfMatrix, material, texture, textureID) {
        this.scene = scene;
        this.nodeID = nodeID;
        this.childNodesID = childNodesID;
        this.childNodes = [];
        this.leafs = leafs;
        this.transfMatrix = tranfMatrix;
        this.material = material;
        this.texture = texture;
        this.textureID = textureID;
    }

    addChildNode(child) {
        this.childNodes.push(child);
    }

    display(material, texture){
        this.scene.pushMatrix();
        this.scene.multMatrix(this.transfMatrix);

        let currentMaterial = material;
        let currentTexture = texture;

        if (this.material != null) {
            currentMaterial = this.material;
        }

        if (this.textureID !== "null") {
            currentTexture = this.texture;
        }

        if (currentMaterial != null) {
            currentMaterial.apply();
        }
            
        if (currentTexture != null)  {
            currentTexture.bind();
        }

        for (let leaf of this.leafs) {
            leaf.display();
        }

        for (let child of this.childNodes) {
            child.display(currentMaterial, currentTexture);
        }
        this.scene.popMatrix();
    }
}
