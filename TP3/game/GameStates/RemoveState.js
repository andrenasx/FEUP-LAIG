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
        console.log(message);
        if(message == 1){
            //seleciona peça e remove
            this.gameOrchestrator.performRemove(this.tile);
            this.gameOrchestrator.changeState(new CheckGameOverState(this.gameOrchestrator));
            this.gameOrchestrator.resetTimer();
        }
        else if(message == 0) {
            //treme peça porque não a pode jogar
        }
    }
}