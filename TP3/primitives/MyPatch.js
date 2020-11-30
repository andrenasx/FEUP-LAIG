/**
 * MyPatch
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {integer} npartsU - number of divisions in the U direction
 * @param {integer} npartsV - number of divisions in the V direction
 * @param {integer} npointsU - number of points in the U direction
 * @param {integer} npointsV - number of points in the V direction
 * @param {integer} controlPoints
 */
class MyPatch extends CGFobject {
	constructor(scene, npartsU, npartsV, npointsU, npointsV, controlPoints) {
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.controlPoints = controlPoints;        
        
		this.nurbs_surface = new CGFnurbsSurface(this.npointsU - 1, this.npointsV - 1, this.controlPoints);
		this.patch = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.nurbs_surface);
    }
    
    display() {
		this.patch.display();
	}
}