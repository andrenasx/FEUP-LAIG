class CheckGameOverState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
    }

    pickTile(tile) {
        //no picking, game is animating
    }

    animationEnd() {
        this.gameOrchestrator.prolog.gameOver();
    }

    receivedReply(message) {
        console.log(message);
        if(message == 1) {
            console.log("Red player won");
            this.gameOrchestrator.changeState(new GameOverState(this.gameOrchestrator));
        }
        else if(message == -1) {
            console.log("Blue player won");
            this.gameOrchestrator.changeState(new GameOverState(this.gameOrchestrator));
        }
        else if(message == 0) {
            console.log("No winners yet");
            this.gameOrchestrator.changeState(new ChangePlayerState(this.gameOrchestrator));
            this.gameOrchestrator.state.animateCamera();
        }
    }
}