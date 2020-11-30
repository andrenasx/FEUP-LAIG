/**
 * GraphNode class, representing a graph node.
 */
class MySceneGraphNode {
    constructor(scene, nodeID, childNodesID, leafs, tranfMatrix, material, texture, textureID, animation) {
        this.scene = scene;
        this.nodeID = nodeID;
        this.childNodesID = childNodesID;
        this.childNodes = [];
        this.leafs = leafs;
        this.transfMatrix = tranfMatrix;
        this.material = material;
        this.texture = texture;
        this.textureID = textureID;
        this.animation = animation;
    }

    addChildNode(child) {
        this.childNodes.push(child);
    }

    display(material, texture){
        this.scene.pushMatrix();
        this.scene.multMatrix(this.transfMatrix);
        if(this.animation != null){
            this.animation.apply(this.scene);
        }

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

        for (let leaf of this.leafs) {
            if (currentTexture != null)  {
                currentTexture.bind();
            }
            leaf.display();
        }

        for (let child of this.childNodes) {
            child.display(currentMaterial, currentTexture);
        }
        this.scene.popMatrix();
    }
}
