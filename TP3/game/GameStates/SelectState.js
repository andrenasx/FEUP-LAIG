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
            // Selected a valid piece, highlight it
            this.tile.piece.highlightPiece();
            this.gameOrchestrator.selectedTile = this.tile;
            this.gameOrchestrator.changeState(new MoveState(this.gameOrchestrator));
        }
        else if(message == 0) {
            // Not valid, select another one
        }
    }
}