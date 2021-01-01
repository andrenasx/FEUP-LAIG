class MoveState extends GameState {
    constructor(gameOrchestrator, selectedTile){
        super(gameOrchestrator);
        this.selectedTile = selectedTile;
    }

    pickTile(moveTile) {
        this.moveTile = moveTile;
        this.gameOrchestrator.prolog.canMoveToTile(this.selectedTile, moveTile);
    }

    pickObj(id) {
        // Unlight selected piece when choosing another obj
        this.selectedTile.getPiece().unlightPiece();
        if(id==100) this.gameOrchestrator.undo()
    }

    receivedReply(message) {
        this.selectedTile.getPiece().unlightPiece();
        if(message == 1){
            // Valid destination piece, performe move and reset timer
            this.gameOrchestrator.performMove(this.selectedTile, this.moveTile);
            this.gameOrchestrator.changeState(new CheckGameOverState(this.gameOrchestrator));
            this.gameOrchestrator.resetTimer();
        }
        else if(message == 0) {
            // Not valid, select piece again
            this.gameOrchestrator.changeState(new SelectState(this.gameOrchestrator));
        }
    }
}