class CheckGameOverState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
    }

    pickTile(tile) {
        //no picking, game is animating
    }

    animationEnd() {
        this.gameOrchestrator.prolog.gameOver();
    }

    receivedReply(message) {
        console.log(message);
        if(message == 1) {
            console.log("Red player won");
            this.gameOrchestrator.changeState(new GameOverState(this.gameOrchestrator));
        }
        else if(message == -1) {
            console.log("Blue player won");
            this.gameOrchestrator.changeState(new GameOverState(this.gameOrchestrator));
        }
        else if(message == 0) {
            console.log("No winners yet");
            this.gameOrchestrator.currentPlayer = -this.gameOrchestrator.currentPlayer;
            [this.gameOrchestrator.playerType, this.gameOrchestrator.enemyType] = [this.gameOrchestrator.enemyType, this.gameOrchestrator.playerType];
            if(this.gameOrchestrator.playerType=="Player")
                this.gameOrchestrator.changeState(new CheckMovesState(this.gameOrchestrator));
            else
                this.gameOrchestrator.changeState(new BotState(this.gameOrchestrator));
        }
    }
}