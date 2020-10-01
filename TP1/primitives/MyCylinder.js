/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject {
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
    
		var angle = 0;
		var beta = 2*Math.PI/this.slices;

		for(var i = 0; i <= this.stacks; i++){
			var radius = (this.topRadius - this.bottomRadius)*(i/this.stacks) + this.bottomRadius;
			var h = this.height * i / this.stacks;
			for(var j = 0; j <= this.slices; j++){
				var x_ang = Math.cos(angle) * radius;
				var z_ang = Math.sin(angle) * radius;
				this.vertices.push(x_ang, z_ang, h);
				this.normals.push(x_ang, z_ang, 0);
				angle += beta;

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

