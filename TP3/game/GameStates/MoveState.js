class MoveState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
    }

    pickTile(tile) {
        this.tile = tile;
        this.gameOrchestrator.prolog.canMoveToTile(tile);
    }

    pickObj(id) {
        this.gameOrchestrator.selectedTile.piece.unlightPiece();
        if(id==100) this.gameOrchestrator.undo()
    }

    receivedReply(message) {
        console.log(message);
        this.gameOrchestrator.selectedTile.piece.unlightPiece();
        if(message == 1){
            //selecionou uma peça de destino correta, faz o movimento
            this.gameOrchestrator.performMove(this.tile);
            this.gameOrchestrator.changeState(new CheckGameOverState(this.gameOrchestrator));
            this.gameOrchestrator.resetTimer();
        }
        else if(message == 0) {
            //treme peça porque não a pode jogar
            this.gameOrchestrator.changeState(new SelectState(this.gameOrchestrator));
        }
    }
}