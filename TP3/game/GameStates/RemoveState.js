class RemoveState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
        gameOrchestrator.startTimer();
    }

    pickTile(tile) {
        this.tile = tile;
        this.gameOrchestrator.prolog.canRemovePiece(tile);
    }

    receivedReply(message) {
        if(message == 1){
            // Valid piece to remove
            this.gameOrchestrator.performRemove(this.tile);
            this.gameOrchestrator.changeState(new CheckGameOverState(this.gameOrchestrator));
            this.gameOrchestrator.resetTimer();
        }
        else if(message == 0) {
            // Not valid, select another one
        }
    }
}