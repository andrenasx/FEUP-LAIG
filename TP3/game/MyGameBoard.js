class MyGameBoard extends CGFobject {
    constructor(scene, size){
        super(scene);
        this.size = size;
        this.board = [];

        this.redMaterial = new CGFappearance(this.scene);
        this.redMaterial.setShininess(5);
        this.redMaterial.setEmission(0, 0, 0, 1);
        this.redMaterial.setAmbient(0.1, 0, 0, 1);
        this.redMaterial.setDiffuse(1, 0, 0, 1),
        this.redMaterial.setSpecular(0, 0, 0, 1);

        this.blueMaterial = new CGFappearance(this.scene);
        this.blueMaterial.setShininess(1);
        this.blueMaterial.setEmission(0, 0, 0, 1);
        this.blueMaterial.setAmbient(0, 0, 0.1, 1);
        this.blueMaterial.setDiffuse(0, 0, 1, 1),
        this.blueMaterial.setSpecular(0, 0, 0, 1);

        this.greyMaterial = new CGFappearance(this.scene);
        this.greyMaterial.setShininess(5);
        this.greyMaterial.setEmission(0, 0, 0, 1);
        this.greyMaterial.setAmbient(0.34, 0.35, 0.36, 1);
        this.greyMaterial.setDiffuse(0.34, 0.35, 0.36, 1),
        this.greyMaterial.setSpecular(0, 0, 0, 1);

        this.createBoard(this.size);

        this.base = new MyCube(this.scene);
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

        if(this.size == 8){
            let side = new MyTrapeze(this.scene, 8, 9, 0.5);
            //top
            this.scene.pushMatrix();
            this.scene.translate(-0.5,0,-0.5);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.blueMaterial.apply();
            side.display();
            this.scene.popMatrix();
            //right
            this.scene.pushMatrix();
            this.scene.translate(8.5,0,-0.5);
            this.scene.rotate(Math.PI/2, 0, 0, 1);
            this.scene.rotate(-Math.PI/2, 0, 1, 0);
            this.redMaterial.apply();
            side.display();
            this.scene.popMatrix();
            //bottom
            this.scene.pushMatrix();
            this.scene.translate(-0.5,0,8.5);
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            this.blueMaterial.apply();
            side.display();
            this.scene.popMatrix();
            //left
            this.scene.pushMatrix();
            this.scene.translate(-0.5,0,-0.5);
            this.scene.rotate(-Math.PI/2, 0, 1, 0);
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            this.redMaterial.apply();
            side.display();
            this.scene.popMatrix();
            }
        else if (this.size == 6) {
            let side = new MyTrapeze(this.scene, 6, 7, 0.5);
            //top
            this.scene.pushMatrix();
            this.scene.translate(-0.5,0,-0.5);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.blueMaterial.apply();
            side.display();
            this.scene.popMatrix();
            //right
            this.scene.pushMatrix();
            this.scene.translate(6.5, 0, -0.5);
            this.scene.rotate(Math.PI/2, 0, 0, 1);
            this.scene.rotate(-Math.PI/2, 0, 1, 0);
            this.redMaterial.apply();
            side.display();
            this.scene.popMatrix();
            //bottom
            this.scene.pushMatrix();
            this.scene.translate(-0.5, 0, 6.5);
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            this.blueMaterial.apply();
            side.display();
            this.scene.popMatrix();
            //left
            this.scene.pushMatrix();
            this.scene.translate(-0.5,0,-0.5);
            this.scene.rotate(-Math.PI/2, 0, 1, 0);
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            this.redMaterial.apply();
            side.display();
            this.scene.popMatrix();
        }

        this.scene.pushMatrix();
        this.scene.translate(this.size/2, -0.155, this.size/2);
        this.scene.scale(this.size + 1.5, 0.3, this.size + 1.5);
        this.greyMaterial.apply();
        this.base.display();
        this.scene.popMatrix();

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
    
    getTile(row, column){
        return this.board[row][column];
    }
}