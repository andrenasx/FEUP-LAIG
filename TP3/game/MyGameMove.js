class MyGameMove {
    constructor(selectedTile, moveTile, board){
        this.piece = selectedTile.getPiece();
        this.selectedTile = selectedTile;
        this.moveTile = moveTile;
        this.board = board;

        this.animation = new MyKeyframeAnimation(
            [
                {
                    instant:0,
                    transformations:[
                        [this.selectedTile.getColumn()+0.5,0,this.selectedTile.getRow()+0.5],
                        0,0,0,
                        [1,1,1]
                    ]
                },
                {
                    instant:2,
                    transformations:[
                        [this.moveTile.getColumn()+0.5,0,this.moveTile.getRow()+0.5],
                        0,0,0,
                        [1,1,1]
                    ]
                }
            ]
        )

        this.selectedTile.removePiece();
        this.finished = false;
    }

    update(delta){
        this.animation.update(delta);
        if(this.animation.finished && !this.finished){
            this.finished = true;
            this.moveTile.setPiece(this.piece);
        }
    }

    animate(){
        this.board.scene.pushMatrix();
        this.animation.apply(this.board.scene);
        this.piece.display();
        this.board.scene.popMatrix();
    }
}