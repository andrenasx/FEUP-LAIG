/**
 * MyCylinderSide
 * @constructor
 * @param  {CGFscene} scene - MyScene object
 * @param {float} height - height
 * @param {float} topRadius - radius of the top circle
 * @param {float} bottomRadius - radius of the bottom circle
 * @param  {integer} stacks - number of divisions along the Z
 * @param  {integer} slices - number of divisions around the circumference
 */

 class MyCylinderSide extends CGFobject {
	constructor(scene, height, topRadius, bottomRadius, stacks, slices) {
		super(scene);
		this.height = height;
		this.topRadius = topRadius;
		this.bottomRadius = bottomRadius;
		this.stacks = stacks;
		this.slices = slices;

		this.initBuffers();
		
	}
	
	initBuffers() {
        this.vertices = [];
        this.indices = [];
		this.normals = [];
		this.texCoords = [];
    
		var angle = 2.0 *Math.PI / this.slices;

		for(var i = 0; i <= this.stacks; i++){
			var beta = 0.0; //current angle
			var radius = (this.topRadius - this.bottomRadius) * (i / this.stacks) + this.bottomRadius; //current radius
			var h = this.height * i / this.stacks; //z
			for(var j = 0; j <= this.slices; j++){
				var x_ang = Math.cos(beta) * radius;
				var y_ang = Math.sin(beta) * radius;
				//Vertices
				this.vertices.push(x_ang, y_ang, h);
				//Normals
				this.normals.push(x_ang, y_ang, 0);
				beta += angle;
				//Text Coords
				this.texCoords.push(j * 1 / this.slices, 1 - (i * 1 / this.stacks));
				}
		}
		//Indices
		for(var i = 0; i < this.stacks; i++){
			for(var j = 0; j < this.slices; j++){
				var ind1 = j + i * (this.slices+1);
				var ind2 = j + i *(this.slices+1)+1;
				var ind3 = j + (i+1)*(this.slices+1);
				var ind4 = j + (i+1)*(this.slices+1)+1;
				this.indices.push(ind4, ind3, ind1);
				this.indices.push(ind1,ind2,ind4);
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	updateBuffers(complexity){
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}

