class MyGameBoard extends CGFobject {
    constructor(scene, size){
        super(scene);
        this.size = size;

        this.redMaterial = new CGFappearance(this.scene);
        this.redMaterial.setShininess(1);
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

        this.wood = new CGFappearance(this.scene);
        this.wood.setShininess(1);
        this.wood.setEmission(0, 0, 0, 1);
        this.wood.setAmbient(1, 1, 1, 1);
        this.wood.setDiffuse(0.8, 0.8, 0.8, 1),
        this.wood.setSpecular(0.3, 0.3, 0.3, 1);
        this.wood.loadTexture("./scenes/images/white_wood.jpg");
        this.wood.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');

        this.base = new MyCube(this.scene);
        this.side = new MyTrapeze(this.scene, this.size, this.size + 1, 0.5);

        this.init();
    }

    init(){
        this.board = [];
        this.createBoard();
    }

    createBoard(){
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
        
        //top
        this.scene.pushMatrix();
        this.scene.translate(-0.5,0,-0.5);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.blueMaterial.apply();
        this.side.display();
        this.scene.popMatrix();
        
        //right
        this.scene.pushMatrix();
        this.scene.translate(this.size+0.5,0,-0.5);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        this.redMaterial.apply();
        this.side.display();
        this.scene.popMatrix();
        
        //bottom
        this.scene.pushMatrix();
        this.scene.translate(-0.5,0,this.size+0.5);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.blueMaterial.apply();
        this.side.display();
        this.scene.popMatrix();
        
        //left
        this.scene.pushMatrix();
        this.scene.translate(-0.5,0,-0.5);
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.redMaterial.apply();
        this.side.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.wood.apply();
        this.scene.translate(this.size/2, -0.155, this.size/2);
        this.scene.scale(this.size + 1.5, 0.3, this.size + 1.5);
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

    getOriginal(){
        let player=1;

        for(let row=0; row<this.size; row++){
            for(let column=0; column<this.size; column++){
                this.board[row][column].setPiece(new MyPiece(this.scene, player));
                player = -player;
            }
            if(this.size%2===0) player = -player;
        }
    }

    updateTheme(game){
        for(let row=0; row<this.size; row++){
            for(let column=0; column<this.size; column++){
                this.board[row][column].updateTheme(game);
            }
        }
    }
}