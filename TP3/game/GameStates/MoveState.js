class MoveState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
    }

    pickTile(tile) {
        this.tile = tile;
        this.gameOrchestrator.prolog.canMoveToTile(tile);
    }

    pickObj(id) {
        // Unlight selected piece when choosing another obj
        this.gameOrchestrator.selectedTile.piece.unlightPiece();
        if(id==100) this.gameOrchestrator.undo()
    }

    receivedReply(message) {
        this.gameOrchestrator.selectedTile.piece.unlightPiece();
        if(message == 1){
            // Valid destination piece, performe move and reset timer
            this.gameOrchestrator.performMove(this.tile);
            this.gameOrchestrator.changeState(new CheckGameOverState(this.gameOrchestrator));
            this.gameOrchestrator.resetTimer();
        }
        else if(message == 0) {
            // Not valid, select piece again
            this.gameOrchestrator.changeState(new SelectState(this.gameOrchestrator));
        }
    }
}