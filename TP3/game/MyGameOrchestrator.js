class MyGameOrchestrator {
    constructor(scene){
        this.scene = scene;
        this.redplayer = "Human";
        this.blueplayer = "Human";
        this.size = 8;
        this.time = 30;
        this.gameSequence = new MyGameSequence(this);
        this.animator = new MyAnimator(this.gameSequence);
        this.prolog = new MyPrologInterface(this);
        this.gameboard = new MyGameBoard(scene, this.size);
        this.auxiliarboard = new MyAuxiliarBoard(scene, this.size);
        this.menu = new MyMenu(this.scene);

        this.state = new InitialState(this);
        this.inited = true;
    }

    //Play
    play(){
        if(!this.inited){
            this.gameSequence.init();
            this.animator.init();
            this.gameboard.init();
            this.auxiliarboard.init();
            this.updateTheme(this.scene.getCurrentTheme().gameProperties);
        }

        if(this.playerType != this.redplayer || this.enemyType != this.blueplayer) this.resetScore();

        this.playerType = this.redplayer;
        this.enemyType = this.blueplayer;

        this.currentPlayer = 1;
        this.scene.interface.hideGameConf();

        if(this.playerType=="Human"){
            this.state = new CheckMovesState(this);
        }
            
        else{
            this.state = new BotState(this);
        }
            

        this.inited = false;
        this.countdown = false;
    }

    //Update
    update(delta){
        this.animator.update(delta);
        this.updateTimer(delta);
    }

    //Display menu, gameboard, auxiliarboard and animator
    display(){
        this.scene.pushMatrix();
        this.scene.translate(this.boards_position[0],this.boards_position[1],this.boards_position[2]);

        // Menu
        this.menu.display();
        
        this.scene.scale(0.1, 0.1, 0.1);
        this.scene.rotate(Math.PI/2, 0, 1, 0);

        //Game Board
        this.gameboard.display();
        
        //Auxiliar board
        this.auxiliarboard.display();

        //Animator
        this.animator.display();

        this.scene.popMatrix();
    }

    //While exists moves avialable, perform two moves, select and move - Human Player
    performMove(selectedTile, moveTile){
        this.gameSequence.addGameMove(new MyGameMove(moveTile, this.auxiliarboard, this.scene));
        this.gameSequence.addGameMove(new MyGameMove(selectedTile, moveTile, this.scene));
        this.gameSequence.lastmoveType = 2;
    }

    //If there are no moves available, perfom one move - Human Player
    performRemove(selectedTile){
        this.gameSequence.addGameMove(new MyGameMove(selectedTile, this.auxiliarboard, this.scene));
        this.gameSequence.lastmoveType = 1;
    }

    //While exists moves avialable, perform two moves, select and move - Bot Player
    performBotMove(selRow,selCol,movRow,movCol){
        this.gameSequence.addGameMove(new MyGameMove(this.gameboard.getTile(movRow,movCol), this.auxiliarboard, this.scene));
        this.gameSequence.addGameMove(new MyGameMove(this.gameboard.getTile(selRow,selCol), this.gameboard.getTile(movRow,movCol), this.scene));
        this.gameSequence.lastmoveType = 2;
    }

    //If there are no moves available, perfom one move - Bot Player
    performBotRemove(selRow,selCol){
        this.gameSequence.addGameMove(new MyGameMove(this.gameboard.getTile(selRow,selCol), this.auxiliarboard, this.scene));
        this.gameSequence.lastmoveType = 1;
    }

    //Undo
    undo(){
        if(this.gameSequence.sequence.length==0) return;
        this.countdown = false;
        this.gameSequence.undo();
        this.state = new CheckGameOverState(this);
    }

    //Movie
    movie(){
        this.gameboard.setOriginal();
        this.auxiliarboard.init();
        this.updateTheme(this.scene.getCurrentTheme().gameProperties)
        this.gameSequence.movie();
        this.state = new MovieState(this);
    }

    //Change game state
    changeState(state){
        this.state = state;
    }

    //Received reply
    receivedReply(msg){
        this.state.receivedReply(msg);
    }

    //Update Theme
    updateTheme(gameProperties){
        this.boards_position = gameProperties["boards"].position;
        this.gameboard.updateTheme(gameProperties);
        this.auxiliarboard.updateTheme(gameProperties);
        this.gameSequence.updateTheme(gameProperties);
    }

    //Start timer
    startTimer() {
        this.timer = this.time;
        this.countdown = true;
   }

   //Reset timer
    resetTimer() {
        this.timer = this.time;
        this.countdown = false;
    }

    //Update score board timer
    updateTimer(delta) {
        if(this.countdown){
            this.timer -= delta;
            if(this.timer <= 0) {
                this.updateScore(-this.currentPlayer);
                this.resetTimer();
            }
            else {
                document.getElementById("time").innerHTML = "Time: " + this.timer.toFixed(1);
            }
        }
    }

    //Score board score reset
    resetScore() {
        document.getElementById('red-score').innerHTML = 0;
        document.getElementById('blue-score').innerHTML = 0;
    }

    //Score board score update
    updateScore(player) {
        this.menu.playButton.makeAvailable();
        this.menu.undoButton.makeUnavailable();
        this.menu.movieButton.makeAvailable();

        if(player == 1) {
            document.getElementById('red-score').innerHTML = parseInt(document.getElementById('red-score').innerHTML) + 1;
            document.getElementById("time").innerHTML = "Red player won!";
        }
        else if (player == -1) {
            document.getElementById('blue-score').innerHTML = parseInt(document.getElementById('blue-score').innerHTML) + 1;
            document.getElementById("time").innerHTML = "Blue player won!";
        }

        this.scene.interface.showGameConf();

        this.state = new InitialState(this)
    }
}