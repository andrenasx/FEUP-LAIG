class MyGameMove {
    constructor(selectedTile, moveTile, scene){
        this.piece = selectedTile.getPiece();
        this.selectedTile = selectedTile;
        this.moveTile = moveTile;
        this.scene = scene;

        this.animation = new MyKeyframeAnimation(
            [
                {
                    instant:0,
                    transformations:[
                        [this.selectedTile.getPosition().x,this.selectedTile.getPosition().y,this.selectedTile.getPosition().z],
                        0,0,0,
                        [1,1,1]
                    ]
                },
                {
                    instant:0.2,
                    transformations:[
                        [this.selectedTile.getPosition().x,this.selectedTile.getPosition().y+1,this.selectedTile.getPosition().z],
                        0,0,0,
                        [1,1,1]
                    ]
                },
                {
                    instant:0.4,
                    transformations:[
                        [this.moveTile.getPosition().x,this.moveTile.getPosition().y+1,this.moveTile.getPosition().z],
                        0,0,0,
                        [1,1,1]
                    ]
                },
                {
                    instant:0.5,
                    transformations:[
                        [this.moveTile.getPosition().x,this.moveTile.getPosition().y,this.moveTile.getPosition().z],
                        0,0,0,
                        [1,1,1]
                    ]
                }
            ]
        )

        this.init = false;
        this.finished = false;
    }

    update(delta){
        if(!this.init){
            this.init = true;
            this.selectedTile.removePiece();
        }
        this.animation.update(delta);
        if(this.animation.finished && !this.finished){
            this.finished = true;
            this.moveTile.setPiece(this.piece);
        }
    }

    animate(){
        this.scene.pushMatrix();
        this.animation.apply(this.scene);
        this.piece.display();
        this.scene.popMatrix();
    }

    resetAnimation(){
        this.animation.reset();
        this.init = false;
        this.finished = false;
    }
}