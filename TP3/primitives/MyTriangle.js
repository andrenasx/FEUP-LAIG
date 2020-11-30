/**
 * MyTriangle
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {float} x1 - x coordinate corner 1
 * @param {float} y1 - y coordinate corner 1
 * @param {float} x2 - x coordinate corner 2
 * @param {float} y2 - y coordinate corner 2
 * @param {float} x3 - x coordinate corner 3
 * @param {float} y3 - y coordinate corner 3
 */
class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, x2, y2, x3, y3) {
		super(scene);
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.x3 = x3;
		this.y3 = y3;
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y2, 0,	//1
            this.x3, this.y3, 0,	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
		];

		//taken from class
		this.a = Math.sqrt(Math.pow((this.x2-this.x1),2)+Math.pow((this.y2-this.y1),2));
		var b = Math.sqrt(Math.pow((this.x3-this.x2),2)+Math.pow((this.y3-this.y2),2));
		var c = Math.sqrt(Math.pow((this.x1-this.x3),2)+Math.pow((this.y1-this.y3),2));

		var cos_alpha = (Math.pow(this.a,2)-Math.pow(b,2)+Math.pow(c,2))/(2*this.a*c);
		var sin_alpha = Math.sqrt(1-Math.pow(cos_alpha,2));

		this.aux1 = c * cos_alpha;
		this.aux2 = 1 - c * sin_alpha;
		
		this.texCoords = [
			0, 1,
			this.a, 1,
			this.aux1, this.aux2
		];
		
		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}

	applyTextures(afs, aft) {
		this.texCoords = [
			0, 1,
			this.a / afs, 1,
			this.aux1 / afs, this.aux2 / aft
		];

		this.updateTexCoordsGLBuffers();
	}
}