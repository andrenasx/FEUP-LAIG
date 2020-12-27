class RemoveState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
    }

    pickTile(tile) {
        this.tile = tile;
        this.gameOrchestrator.prolog.canRemovePiece(tile);
    }

    animationEnd() {
        //no game animations
    }

    receivedReply(message) {
        console.log(message);
        if(message == 1){
            //seleciona peça e remove
            this.gameOrchestrator.performRemove(this.tile);
            this.gameOrchestrator.changeState(new CheckGameOverState(this.gameOrchestrator));
        }
        else if(message == 0) {
            //treme peça porque não a pode jogar
        }
    }
}