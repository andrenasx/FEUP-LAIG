class MyGameMove {
    constructor(selectedTile, moveTile, scene){
        this.piece = selectedTile.getPiece();
        this.selectedTile = selectedTile;
        this.moveTile = moveTile;
        this.selectedPosition = this.selectedTile.getPosition();
        this.movePosition = this.moveTile.getPosition();
        this.scene = scene;

        this.createAnimation(this.selectedPosition, this.movePosition);

        this.init = false;
        this.finished = false;
    }

    createAnimation(selectedPosition, movePosition) {
        this.animation = new MyKeyframeAnimation(
            [
                {
                    instant:0,
                    transformations:[
                        [selectedPosition.x, selectedPosition.y, selectedPosition.z],
                        0,0,0,
                        [1,1,1]
                    ]
                },
                {
                    instant:0.2,
                    transformations:[
                        [selectedPosition.x, selectedPosition.y+1, selectedPosition.z],
                        0,0,0,
                        [1,1,1]
                    ]
                },
                {
                    instant:0.4,
                    transformations:[
                        [movePosition.x, movePosition.y+1, movePosition.z],
                        0,0,0,
                        [1,1,1]
                    ]
                },
                {
                    instant:0.5,
                    transformations:[
                        [movePosition.x, movePosition.y, movePosition.z],
                        0,0,0,
                        [1,1,1]
                    ]
                }
            ]
        )
    }

    update(delta){
        if(!this.init){
            // If not inited change flag and remove piece from selected tile
            this.init = true;
            this.selectedTile.removePiece();
        }

        this.animation.update(delta);

        if(this.animation.finished && !this.finished){
            this.finished = true;
            this.moveTile.setPiece(this.piece); //Set piece in the destination tile when animation is done
        }
    }

    // Apply animation to piece
    animate(){
        this.scene.pushMatrix();
        this.animation.apply(this.scene);
        this.piece.display();
        this.scene.popMatrix();
    }

    // Reset animation and flags
    resetAnimation(){
        this.animation.reset();
        this.init = false;
        this.finished = false;
    }

    // Reverse 
    reverse(){
        this.piece = this.moveTile.getPiece(); // Piece is now from the destination tile
        [this.selectedTile, this.moveTile] = [this.moveTile, this.selectedTile]; // Reverse tiles
        [this.selectedPosition, this.movePosition] = [this.movePosition, this.selectedPosition]; // Reverse positions
        this.createAnimation(this.selectedPosition, this.movePosition); // Reverse animation to new positions

        // Reset flags
        this.init = false;
        this.finished = false;
    }
}