/**
 * MyTorus
 * @constructor
 */
class MyTorus extends CGFobject {
	constructor(scene, inner, outer, slices, loops) {
		super(scene);
		this.inner = inner;
		this.outer = outer;
		this.slices = slices;
		this.loops = loops;
		this.initBuffers();
		
	}
	
	initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

		for(var i = 0; i <= this.loops; i++){
			var alpha = i * 2 * Math.PI / this.loops;
			for(var j = 0; j <= this.slices; j++){
				var beta = j * 2 * Math.PI / this.slices;
				
				var x = (this.outer + this.inner * Math.cos(beta)) * Math.cos(alpha);
				var y = (this.outer+ this.inner * Math.cos(beta)) * Math.sin(alpha);
				var z = this.inner * Math.sin(beta);
				
				this.vertices.push(x,y,z);
				this.normals.push(x,y,z);

				var ind1 = (i * (this.slices+1))+j;
				var ind2 = ind1 + this.slices+1;
				this.indices.push(ind1, ind2, ind1+1);
				this.indices.push(ind2,ind2+1,ind1+1);

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

