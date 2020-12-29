class SelectState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
    }

    pickTile(tile) {
        this.tile = tile;
        this.gameOrchestrator.prolog.canChooseTile(tile);
    }

    pickObj(id) {
        if(id==100) this.gameOrchestrator.undo()
    }

    receivedReply(message) {
        console.log(message)
        if(message == 1){
            //seleciona peça e dá highlight de tiles inimigos à volta
            this.tile.piece.highlightPiece();
            this.gameOrchestrator.selectedTile = this.tile;
            this.gameOrchestrator.changeState(new MoveState(this.gameOrchestrator));
        }
        else if(message == 0) {
            //treme peça porque não a pode jogar
        }
    }
}