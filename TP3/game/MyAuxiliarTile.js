class MyAuxiliarTile extends CGFobject {
    constructor(scene, row, column){
        super(scene);
        this.row = row;
        this.column = column;

        this.tile = new MyPlane(scene, 5, 5);
        this.pieces = [];

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
        this.displayPieces();
        this.scene.popMatrix();
    }

    displayPieces(){
        for(let piece of this.pieces){
            piece.display();
        }
    }

    setPiece(piece){
        this.pieces.push(piece);
    }

    getPiece(){
        return this.pieces[this.pieces.length-1];
    }

    removePiece(){
        this.pieces.pop();
    }

    getRow(){
        return this.row;
    }

    getColumn(){
        return this.column;
    }
}