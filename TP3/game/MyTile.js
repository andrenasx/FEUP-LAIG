class MyTile extends CGFobject {
    constructor(scene, row, column){
        super(scene);
        this.row = row;
        this.column = column;

        this.tile = new MyPlane(scene, 5, 5);
        this.piece = null;

        this.material= new CGFappearance(scene);
        this.material.setShininess(5);
        this.material.setEmission(0, 0, 0, 1);
        this.material.setAmbient(0.1, 0.1, 0.1, 1);
        this.material.setDiffuse(1, 1, 1, 1),
        this.material.setSpecular(0.1, 0.1, 0.1, 1);
    }

    display(){
        this.scene.pushMatrix();
        this.material.apply();
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