class MySpriteAnimation extends CGFobject {
	constructor(scene, spritesheet, startCell, endCell, duration) {
		super(scene);
        this.startCell = startCell;
        this.endCell = endCell;
        this.duration = duration;
        this.spritesheet = spritesheet;

        this.elapsedTime = 0;
        this.cell = this.startCell;
        this.cellTime = duration/(this.endCell - this.startCell + 1);

        this.rectangle = new MyRectangle(this.scene, 0,0,1,1);
    }

    update(deltaTime){
        if(this.cell == this.endCell) this.cell = this.startCell;
        
        this.elapsedTime += deltaTime;
        
        if(this.elapsedTime >= this.cellTime){
            this.cell++;
            this.elapsedTime = 0;
        }
    }

    display(){
        this.scene.setActiveShader(this.spritesheet.shader);
        this.spritesheet.texture.bind(0);

        this.scene.pushMatrix();
        this.spritesheet.activateCellP(this.cell);
        this.rectangle.display();
        this.scene.popMatrix();

        this.scene.setActiveShader(this.scene.defaultShader);
    }
}