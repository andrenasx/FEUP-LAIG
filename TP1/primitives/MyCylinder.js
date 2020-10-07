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

        this.cylinder_side = new MyCylinderSide(scene, height, topRadius, bottomRadius, stacks, slices);
        this.top_circle = new MyCircle(scene, topRadius, slices);
        this.bottom_circle = new MyCircle(scene, bottomRadius, slices);
		
	}
	
	
    display(){
        //Top
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.height);
        this.top_circle.display();
        this.scene.popMatrix();

        //Bottom
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.bottom_circle.display();
        this.scene.popMatrix();

        this.cylinder_side.display();
    }
    
}

