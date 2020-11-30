class MyGameBoard extends CGFobject {
    constructor(scene, size){
        super(scene);
        this.size = size;
        this.tiles = [];
        for(let row=0; row<this.size; row++){
            for(let column=0; column<this.size; column++){
                this.current_tile = new MyTile(scene);
                if((row+column)%2 == 0){
                    this.current_tile.setPiece(new MyPiece(this.scene, 'red'));
                }
                else{
                    this.current_tile.setPiece(new MyPiece(this.scene, 'blue'));
                }
                this.tiles.push(this.current_tile);
            }
        }

        this.selectedTile = null;
        this.moveTile = null;
    }

    display(){
        this.handlePicking();
		this.scene.clearPickRegistration();
        for(let row=0; row<this.size; row++){
            for(let column=0; column<this.size; column++){
                this.scene.pushMatrix();
                this.scene.translate((column*1.1), 0, (row*1.1));
                this.scene.registerForPick(row*this.size+column, this.tiles[row*this.size+column]);
                this.tiles[row*this.size+column].display();
                this.scene.popMatrix();
            }
        }
    }

    handlePicking(){
        let pickedID = this.scene.logPicking();

        if(pickedID!=null){
            if(this.selectedTile==null){
                this.selectedTile = pickedID;
            }
            else {
                if(this.selectedTile!=pickedID){
                    this.movePiece(this.selectedTile, pickedID);
                    this.selectedTile=null;
                }
            }
        }
    }

    movePiece(selectedID, moveID){
        let piece = this.tiles[selectedID].getPiece();
        this.tiles[selectedID].removePiece();
        this.tiles[moveID].setPiece(piece);
    }
}