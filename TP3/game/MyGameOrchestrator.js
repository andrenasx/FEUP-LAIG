class MyGameOrchestrator {
    constructor(scene, player1, player2, size){
        this.scene = scene;
        this.player1 = player1;
        this.player2 = player2;
        this.size = size;
        this.gameSequence = new MyGameSequence(this);
        this.animator = new MyAnimator(this.gameSequence);
        this.prolog = new MyPrologInterface(this);
        this.gameboard = new MyGameBoard(scene, this.size);
        this.auxiliarboard = new MyAuxiliarBoard(scene);
        this.menu = new MyMenu(this.scene);

        console.log("Red Player: ", this.player1);
        console.log("Blue Player: ", this.player2);
        console.log("Board Size: ", this.size);
        this.playerType = this.player1;
        this.enemyType = this.player2;

        this.currentPlayer = 1;
        this.selectedTile = null;

        this.state = new InitialState(this);
    }

    update(delta){
        this.animator.update(delta);
    }

    display(){
        this.managePick(this.scene.pickMode, this.scene.pickResults);
        //board
        if(this.size == 8){
            this.scene.pushMatrix();
            this.scene.translate(5.1, 0.86, 2.13);
            this.scene.scale(0.1, 0.1, 0.1);
            this.gameboard.display();
            this.scene.popMatrix();
        }
        else if(this.size == 6) {
            this.scene.pushMatrix();
            this.scene.translate(5.2, 0.86, 2.2);
            this.scene.scale(0.1, 0.1, 0.1);
            this.gameboard.display();
            this.scene.popMatrix();
        }
        
        //auxiliar board
        this.auxiliarboard.display();

        this.animator.display();

        this.scene.pushMatrix();
        this.scene.translate(6.05, 1, 2.48)
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        this.scene.scale(0.7, 0.5, 0.03);
        this.menu.display();
        this.scene.popMatrix();
    }

    managePick(mode, pickResults) {
        if (mode == false){
            if (pickResults != null && pickResults.length > 0) {
                for (let i=0; i< pickResults.length; i++) {
                    let obj = pickResults[i][0]; // get object from result
                    if (obj instanceof MyTile) {
                        this.state.pickTile(obj);

                        //var uniqueId = pickResults[i][1] // get id
                    }
                }
                // clear results
                pickResults.splice(0, pickResults.length);
            }
        }
    }

    performMove(moveTile){
        this.gameSequence.addGameMove(new MyGameMove(moveTile, this.auxiliarboard.getTile(), this.gameboard));
        this.gameSequence.addGameMove(new MyGameMove(this.selectedTile, moveTile, this.gameboard));
    }

    performRemove(selectedTile){
        this.gameSequence.addGameMove(new MyGameMove(selectedTile, this.auxiliarboard.getTile(), this.gameboard));
    }

    performBotMove(selRow,selCol,movRow,movCol){
        this.gameSequence.addGameMove(new MyGameMove(this.gameboard.getTile(movRow,movCol), this.auxiliarboard.getTile(), this.gameboard));
        this.gameSequence.addGameMove(new MyGameMove(this.gameboard.getTile(selRow,selCol), this.gameboard.getTile(movRow,movCol), this.gameboard));
    }

    performBotRemove(selRow,selCol){
        this.gameSequence.addGameMove(new MyGameMove(this.gameboard.getTile(selRow,selCol), this.auxiliarboard.getTile(), this.gameboard));
    }

    changeState(state){
        this.state = state;
    }

    receivedReply(msg){
        this.state.receivedReply(msg);
    }
}