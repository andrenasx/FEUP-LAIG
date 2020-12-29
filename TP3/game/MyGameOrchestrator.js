class MyGameOrchestrator {
    constructor(scene, player1, player2, size, time){
        this.scene = scene;
        this.player1 = player1;
        this.player2 = player2;
        this.size = size;
        this.time = time;
        this.gameSequence = new MyGameSequence(this);
        this.animator = new MyAnimator(this.gameSequence);
        this.prolog = new MyPrologInterface(this);
        this.gameboard = new MyGameBoard(scene, this.size);
        this.auxiliarboard = new MyAuxiliarBoard(scene, this.size);
        this.menu = new MyMenu(this.scene);

        console.log("Red Player: ", this.player1);
        console.log("Blue Player: ", this.player2);
        console.log("Board Size: ", this.size);
        console.log("Time for play: ", this.time);
        this.playerType = this.player1;
        this.enemyType = this.player2;

        this.currentPlayer = 1;
        this.selectedTile = null;
        
        this.updateTime();
        this.state = new InitialState(this);
        
    }

    updateTime() {
        var timeleft = this.time;
        this.downloadTimer = setInterval(function(){
          if(timeleft <= 0){
            clearInterval(this.downloadTimer);
            //document.getElementById("time").innerHTML = "Finished";
          } else {
            document.getElementById("time").innerHTML = "Time: " + timeleft + " seconds remaining";
            this.left = timeleft;
          }
          timeleft -= 1;
      }, 1000);
    }

    stopTime() {
        clearInterval(this.downloadTimer);
    }

    update(delta){
        this.animator.update(delta);
    }

    display(){
        this.scene.pushMatrix();
        this.scene.translate(5.5, 1.05, 1.85)
        this.scene.rotate(-Math.PI/8, 1, 0, 0);
        this.scene.scale(0.7, 0.5, 0.03);
        this.menu.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        if(this.size == 8){
            this.scene.translate(5.1, 0.86, 2.9);
            this.scene.scale(0.1, 0.1, 0.1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
        }
        else if(this.size == 6) {
            this.scene.translate(5.2, 0.86, 2.8);
            this.scene.scale(0.1, 0.1, 0.1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            
        }
        //Game Board
        this.gameboard.display();
        
        //Auxiliar board
        this.auxiliarboard.display();

        //Animator
        this.animator.display();

        this.scene.popMatrix();
    }

    performMove(moveTile){
        this.gameSequence.addGameMove(new MyGameMove(moveTile, this.auxiliarboard, this.scene));
        this.gameSequence.addGameMove(new MyGameMove(this.selectedTile, moveTile, this.scene));
        this.gameSequence.lastmoveType = 2;
    }

    performRemove(selectedTile){
        this.gameSequence.addGameMove(new MyGameMove(selectedTile, this.auxiliarboard, this.scene));
        this.gameSequence.lastmoveType = 1;
    }

    performBotMove(selRow,selCol,movRow,movCol){
        this.gameSequence.addGameMove(new MyGameMove(this.gameboard.getTile(movRow,movCol), this.auxiliarboard, this.scene));
        this.gameSequence.addGameMove(new MyGameMove(this.gameboard.getTile(selRow,selCol), this.gameboard.getTile(movRow,movCol), this.scene));
        this.gameSequence.lastmoveType = 2;
    }

    performBotRemove(selRow,selCol){
        this.gameSequence.addGameMove(new MyGameMove(this.gameboard.getTile(selRow,selCol), this.auxiliarboard, this.scene));
        this.gameSequence.lastmoveType = 1;
    }

    undo(){
        if(this.gameSequence.sequence.length==0) return;
        this.gameSequence.undo()
        this.state = new CheckGameOverState(this)
    }

    replay(){
        this.gameSequence.replay();
    }

    changeState(state){
        this.state = state;
    }

    receivedReply(msg){
        this.state.receivedReply(msg);
    }
}