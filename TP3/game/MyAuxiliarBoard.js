class MyAuxiliarBoard extends CGFobject {
    constructor(scene){
        super(scene);
        this.board = [];

        this.createBoard(1);
    }

    createBoard(size){
        this.size = size;
        this.board.push(new MyAuxiliarTile(this.scene, 0, -2))
    }

    display(){
        for(let row=0; row<this.size; row++){
            this.scene.pushMatrix();
            this.scene.translate((-2+0.5), 0, (row+0.5));
            this.board[row].display();
            this.scene.clearPickRegistration();
            this.scene.popMatrix();
        }
    }

    getTile(){
        return this.board[0];
    }
}