class MoveState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
    }

    pickTile(tile) {
        this.tile = tile;
        this.gameOrchestrator.prolog.canMoveToTile(tile);
    }

    animationEnd() {
        //no game animations
    }

    receivedReply(message) {
        console.log(message);
        if(message == 1){
            //selecionou uma peça de destino correta, faz o movimento
            this.gameOrchestrator.performMove(this.tile);
            this.gameOrchestrator.changeState(new CheckGameOverState(this.gameOrchestrator));
        }
        else if(message == 0) {
            //treme peça porque não a pode jogar
            this.gameOrchestrator.changeState(new SelectState(this.gameOrchestrator));
        }
    }
}