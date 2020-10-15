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

		var alpha = 2 * Math.PI / this.loops; //loops angle
		var beta = 2 * Math.PI / this.slices; //slices angle

		for(var i = 0; i <= this.slices; i++){
			for(var j = 0; j <= this.loops; j++){
				var x = (this.outer + this.inner * Math.cos(alpha*j)) * Math.cos(beta*i);
				var y = (this.outer + this.inner * Math.cos(alpha*j)) * Math.sin(beta*i);
				var z = this.inner * Math.sin(alpha*j);
				//Vertices
				this.vertices.push(x,y,z);
				//Text Coords
				this.texCoords.push(
					i*1/this.slices, 
					j*1/this.loops	
				);
				//Normals
				this.normals.push(
					Math.cos(alpha*j) * Math.cos(beta*i), 
                    Math.cos(alpha*j) * Math.sin(beta*i),
                    0
				);
			}
		}

		//Indices
		for (let i = 0; i < this.slices; ++i) {
			for(let j = 0; j < this.loops; ++j) {
				this.indices.push(
					(i+1)*(this.loops+1) + j, i*(this.loops+1) + j+1, i*(this.loops+1) + j,
					i*(this.loops+1) + j+1, (i+1)*(this.loops+1) + j, (i+1)*(this.loops+1) + j+1
				);
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

