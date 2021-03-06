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

        this.rectangle = new MyRectangle(this.scene, -0.5,-0.5,0.5,0.5);
    }

    update(deltaTime){
        this.elapsedTime += deltaTime;
        
        if(this.elapsedTime > this.duration) this.elapsedTime=0;

        this.cell = Math.floor(this.elapsedTime / this.cellTime) + this.startCell;
    }

    display(){
        this.spritesheet.setUniValues();
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);

        this.scene.pushMatrix();
        this.spritesheet.activateCellP(this.cell);
        this.rectangle.display();
        this.scene.popMatrix();

        this.scene.gl.disable(this.scene.gl.BLEND);
        this.scene.setActiveShaderSimple(this.scene.defaultShader);
    }
}