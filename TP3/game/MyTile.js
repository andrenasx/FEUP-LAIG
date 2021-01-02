class MyTile extends CGFobject {
    constructor(scene, row, column){
        super(scene);
        this.row = row;
        this.column = column;

        this.tile = new MyPlane(scene, 5, 5);
        this.piece = null;
    }

    display(){
        this.scene.pushMatrix();
        this.material.apply();
        this.texture.bind();
        this.tile.display();
        if(this.piece) this.piece.display();
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

    updateTheme(gameProperties){
        this.material = gameProperties["tiles"].material;
        this.texture = gameProperties["tiles"].texture;
        if(this.piece) this.piece.updateTheme(gameProperties)
    }
}