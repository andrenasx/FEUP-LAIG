class MySpriteAnimation extends CGFobject {
	constructor(scene, spritesheet, startCell, endCell, duration) {
		super(scene);
        this.startCell = startCell;
        this.endCell = endCell;
        this.duration = duration;
        this.spritesheet = spritesheet;

        this.elapsedTime = 0;
        this.finished = false;
        this.p = this.startCell;
        this.totalP = this.endCell - this.startCell;

        this.rectangle = new MyRectangle(this.scene, 0,0,1,1);
    }

    update(deltaTime){
        if(!this.finished) this.elapsedTime += deltaTime;

        if(this.elapsedTime < this.duration){
            this.p = this.startCell + this.elapsedTime * (this.totalP / this.duration);
        }
        else{
            if(!this.finished){
                this.p = this.endCell;
                this.finished = true;
            }
        }
    }

    display(){
        this.scene.setActiveShader(this.spritesheet.shader);
        this.spritesheet.texture.bind(0);

        this.scene.pushMatrix();
        this.spritesheet.activateCellP(this.p);
        this.rectangle.display();
        this.scene.popMatrix();

        this.scene.setActiveShader(this.scene.defaultShader);
    }
}