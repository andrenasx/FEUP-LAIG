class CheckMovesState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
        gameOrchestrator.prolog.hasAnyPossibleMoves();
    }

    receivedReply(message) {
        console.log(message);
        if(message>0){
            console.log("Has moves");
            this.gameOrchestrator.changeState(new SelectState(this.gameOrchestrator));
        }
        else {
            console.log("No moves");
            this.gameOrchestrator.changeState(new RemoveState(this.gameOrchestrator));
        }
        
        this.gameOrchestrator.startTimer();
    }
}