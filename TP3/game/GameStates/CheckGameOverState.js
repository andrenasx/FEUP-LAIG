class CheckGameOverState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
    }

    animationEnd() {
        // When piece animation is over check for gameover
        this.gameOrchestrator.prolog.gameOver();
    }

    receivedReply(message) {
        console.log(message);
        if(message == 1) {
            console.log("Red player won");
            this.gameOrchestrator.menu.toggleAvailability();
            this.gameOrchestrator.updateScore(message);
        }
        else if(message == -1) {
            console.log("Blue player won");
            this.gameOrchestrator.menu.toggleAvailability();
            this.gameOrchestrator.updateScore(message);
        }
        else if(message == 0) {
            console.log("No winners yet");
            this.gameOrchestrator.changeState(new ChangePlayerState(this.gameOrchestrator));
            this.gameOrchestrator.state.animateCamera();
        }
    }
}