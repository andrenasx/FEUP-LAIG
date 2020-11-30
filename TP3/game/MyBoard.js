class MyBoard extends CGFobject {
    constructor(scene, size){
        super(scene);
        this.size = size;
        this.tiles = [];
        for(let row=0; row<this.size; row++){
            for(let column=0; column<this.size; column++){
                this.current_tile = new MyBoardTile(scene);
                if((row+column)%2 == 0){
                    this.current_tile.setPiece(new MyPiece(this.scene, 'red'));
                }
                else{
                    this.current_tile.setPiece(new MyPiece(this.scene, 'blue'));
                }
                this.tiles.push(this.current_tile);
            }
        }
    }

    display(){
        for(let row=0; row<this.size; row++){
            for(let column=0; column<this.size; column++){
                this.scene.pushMatrix();
                this.scene.translate((column*1.1), 0, (row*1.1));
                this.tiles[row*this.size+column].display();
                this.scene.popMatrix();
            }
        }
    }
}