class CheckMovesState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
        gameOrchestrator.prolog.hasAnyPossibleMoves();
    }

    receivedReply(message) {
        if(message>0){
            // If there are available moves, select a piece to move
            this.gameOrchestrator.changeState(new SelectState(this.gameOrchestrator));
        }
        else {
            // Else select a piece to remove
            this.gameOrchestrator.changeState(new RemoveState(this.gameOrchestrator));
        }
        
        this.gameOrchestrator.startTimer();
    }
}