/**
 * MyPatch
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {integer} npartsU - number of divisions in the U direction
 * @param {integer} npartsV - number of divisions in the V direction
 */
class MyPatch extends CGFobject {
	constructor(scene, npartsU, npartsV, npointsU, npointsV, controlPoints) {
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.controlPoints = controlPoints;

        let controlVertexes = [];

		for (let i = 0; i < this.npointsU; i++) {
			let upoints = [];
			for (let j = 0; j < this.npointsV; j++) {
				let point = Object.values(this.controlPoints[i * this.npointsV + j]);
				point.push(1);
				upoints.push(point);
			}
			controlVertexes.push(upoints);
		}
        
        
        this.nurbs_surface = new CGFnurbsSurface(this.npointsU - 1, this.npointsV - 1, controlVertexes);
		this.patch = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.nurbs_surface);
    }
    
    display() {
		this.patch.display();
	}
}