class MyBoardTile extends CGFobject {
    constructor(scene){
        super(scene);
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

    removePiece(){
        this.piece = null;
    }
}