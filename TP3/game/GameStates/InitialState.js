class InitialState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
        this.gameOrchestrator.prolog.gameOver();
    }

    pickTile(tile) {
        //no picking
    }

    animationEnd() {
        //no animation
    }

    receivedReply(message) {
        if(this.gameOrchestrator.playerType=="Player")
            this.gameOrchestrator.changeState(new CheckMovesState(this.gameOrchestrator));
        else
            this.gameOrchestrator.changeState(new BotState(this.gameOrchestrator));
    }
}