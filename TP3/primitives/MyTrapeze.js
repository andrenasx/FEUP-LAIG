class MyTrapeze extends CGFobject {
	constructor(scene, smallBase, bigBase, height) {
        super(scene);
        this.smallBase = smallBase;
        this.bigBase = bigBase;
        this.height = height;
        this.triangleBase = (this.bigBase - this.smallBase) / 2;
        
        this.triangle = new MyTriangle(scene, 0, 0, this.triangleBase, 0, this.triangleBase, this.height);
        this.rectangle = new MyRectangle(scene, this.triangleBase, 0, this.smallBase+this.triangleBase, this.height);
	}
	
    display(){
        this.triangle.display();
        this.rectangle.display();
        this.scene.pushMatrix();
        this.scene.translate(this.bigBase, 0 ,0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.triangle.display();
        this.scene.popMatrix();
    }
    
}

