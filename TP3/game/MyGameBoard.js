class MyGameBoard extends CGFobject {
    constructor(scene, size){
        super(scene);
        this.size = size;
        this.tiles = [];

        for(let row=0; row<this.size; row++){
            for(let column=0; column<this.size; column++){
                let color;
                if((row+column)%2 == 0){
                    color = 'red'
                }
                else{
                    color = 'blue'
                }

                let current_tile = new MyTile(scene);
                let current_piece = new MyPiece(this.scene, color);
                current_tile.setPiece(current_piece);

                this.tiles.push(current_tile);
            }
        }

        this.selectedTile = null;
    }

    display(){
		this.scene.clearPickRegistration();
        for(let row=0; row<this.size; row++){
            for(let column=0; column<this.size; column++){
                this.scene.pushMatrix();
                this.scene.translate((column*1.1), 0, (row*1.1));
                this.scene.registerForPick(row*this.size+column+1, this.tiles[row*this.size+column]);
                this.tiles[row*this.size+column].display();
                this.scene.clearPickRegistration();
                this.scene.popMatrix();
            }
        }
    }

    movePiece(selectedID, moveID){
        let piece = this.tiles[selectedID-1].getPiece();
        
        this.tiles[selectedID-1].removePiece();
        this.tiles[moveID-1].setPiece(piece);
    }
}