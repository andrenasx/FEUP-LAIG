class MyGameBoard extends CGFobject {
    constructor(scene){
        super(scene);
        this.board = [];

        this.createBoard(8);
    }

    createBoard(size){
        this.size = size;
        let player=1;
        
        for(let row=0; row<this.size; row++){
            let rowtiles=[];
            for(let column=0; column<this.size; column++){
                let current_tile = new MyTile(this.scene, row, column);
                let current_piece = new MyPiece(this.scene, player);
                current_tile.setPiece(current_piece);

                rowtiles.push(current_tile);
                player = -player;
            }
            this.board.push(rowtiles);
            if(this.size%2===0) player = -player;
        }
    }

    display(){
		this.scene.clearPickRegistration();
        for(let row=0; row<this.size; row++){
            for(let column=0; column<this.size; column++){
                this.scene.pushMatrix();
                this.scene.translate((column+0.5), 0, (row+0.5));
                this.scene.registerForPick(row*this.size+column+1, this.board[row][column]);
                this.board[row][column].display();
                this.scene.clearPickRegistration();
                this.scene.popMatrix();
            }
        }
    }

    toString() {
        let board = [];
        for (let row = 0; row < this.size; row++) {
            let rowlist = []
            for (let column = 0; column < this.size; column++) {
                if (this.board[row][column].piece) {
                    rowlist.push(this.board[row][column].piece.player)
                } else {
                    rowlist.push(0)
                }
            }
            board.push(rowlist)
        }
        return JSON.stringify(board)
    }
}