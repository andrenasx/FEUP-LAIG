class CheckMovesState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
        gameOrchestrator.prolog.hasAnyPossibleMoves();
    }

    receivedReply(message) {
        console.log(message);
        if(message>0){
            console.log("Has moves");
            // If there are available moves, select a piece to move
            this.gameOrchestrator.changeState(new SelectState(this.gameOrchestrator));
        }
        else {
            console.log("No moves");
            // Else select a piece to remove
            this.gameOrchestrator.changeState(new RemoveState(this.gameOrchestrator));
        }
        
        this.gameOrchestrator.startTimer();
    }
}