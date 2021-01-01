class SelectState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
    }

    pickTile(selectedTile) {
        this.selectedTile = selectedTile;
        this.gameOrchestrator.prolog.canChooseTile(selectedTile);
    }

    pickObj(id) {
        if(id==100) this.gameOrchestrator.undo()
    }

    receivedReply(message) {
        if(message == 1){
            // Selected a valid piece, highlight it
            this.selectedTile.getPiece().highlightPiece();
            this.gameOrchestrator.changeState(new MoveState(this.gameOrchestrator, this.selectedTile));
        }
        else if(message == 0) {
            // Not valid, select another one
        }
    }
}