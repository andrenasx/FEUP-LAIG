class MyTile extends CGFobject {
    constructor(scene, row, column){
        super(scene);
        this.row = row;
        this.column = column;

        this.tile = new MyPlane(scene, 5, 5);
        this.piece = null;

        this.square = new CGFappearance(this.scene);
        this.square.setShininess(1);
        this.square.setEmission(0, 0, 0, 1);
        this.square.setAmbient(1, 1, 1, 1);
        this.square.setDiffuse(0.8, 0.8, 0.8, 1),
        this.square.setSpecular(0.3, 0.3, 0.3, 1);
        this.square.loadTexture("./scenes/images/square.jpg");
        this.square.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
    }

    display(){
        this.scene.pushMatrix();
        this.square.apply();
        this.tile.display();
        if(this.piece!=null) this.piece.display();
        this.scene.popMatrix();
    }

    setPiece(piece){
        this.piece = piece;
    }

    getPiece(){
        return this.piece;
    }

    removePiece(){
        this.piece = null;
    }

    getPosition(){
        return {x:this.column+0.5, y:0, z:this.row+0.5}
    }

    updateTheme(game){
        if(this.piece) this.piece.updateTheme(game)
    }
}