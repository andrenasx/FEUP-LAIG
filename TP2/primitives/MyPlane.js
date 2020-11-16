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
			[
				[-0.5, 0.0,  0.5],	
				[-0.5, 0.0, -0.5]	
			],
			
			[
				[0.5, 0.0,  0.5],	
				[0.5, 0.0, -0.5]		
			]
        ];
        
        this.nurbs_surface = new CGFnurbsSurface(1, 1, controlPoints);
		this.plane = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.nurbs_surface);
    }
    
    display() {
		this.plane.display();
	}
}