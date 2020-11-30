/**
 * MyPlane
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {integer} npartsU - number of divisions in the U direction
 * @param {integer} npartsV - number of divisions in the V direction
 */
class MyPlane extends CGFobject {
	constructor(scene, npartsU, npartsV) {
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;

        const controlPoints = 
		[
			//U0
			[
				//V1
				[-0.5, 0.0,  0.5, 1],
				//V0
				[-0.5, 0.0, -0.5, 1]
			],
			//U1
			[
				//V1
				[0.5, 0.0,  0.5, 1],
				//V0
				[0.5, 0.0, -0.5, 1]
			]
        ];
        
        this.nurbs_surface = new CGFnurbsSurface(1, 1, controlPoints);
		this.plane = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.nurbs_surface);
    }
    
    display() {
		this.plane.display();
	}
}