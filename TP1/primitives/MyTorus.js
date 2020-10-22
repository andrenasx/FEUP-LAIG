/**
 * MyTorus
 * @constructor
 * @param {CFGscene} scene - MyScene object
 * @param {float} inner - the 'tube' radius
 * @param {float} outer - radius of the 'circular axis'
 * @param {integer} slices - number of 'sides' around the inner circle
 * @param {integer} loops - number of loops around the 'circular axis'
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
		this.texCoords = [];

		for(var loop = 0; loop <= this.loops; loop++){
			var alpha = loop * 2 * Math.PI / this.loops; //loops angle

			for(var slice = 0; slice <= this.slices; slice++){
				var beta = slice * 2 * Math.PI / this.slices; //slices angle

				var x = (this.outer + this.inner * Math.cos(beta)) * Math.cos(alpha);
				var y = (this.outer + this.inner * Math.cos(beta)) * Math.sin(alpha);
				var z = this.inner * Math.sin(beta);

				//Vertices
				this.vertices.push(x,y,z);

				//Text Coords
				this.texCoords.push(1-(loop/this.loops), 1-(slice/this.slices));
				
				//Normals
				x -= Math.cos(alpha)*this.outer; // x normal component
				y -= Math.sin(alpha)*this.outer; // y normal component
				this.normals.push(x, y, z);
			}
		}

		//Indices
		for (var loop = 0; loop < this.loops; loop++) {
            for (var slice = 0; slice < this.slices; slice++) {
                var first = loop*(this.slices + 1) + slice;
                var second = first + this.slices + 1;
                this.indices.push(first, second, first + 1);
                this.indices.push(second, second + 1, first + 1);
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

