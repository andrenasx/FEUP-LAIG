class CheckGameOverState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
    }

    animationEnd() {
        // When piece animation is over check for gameover
        this.gameOrchestrator.prolog.gameOver();
    }

    receivedReply(message) {
        if(message == 1 || message == -1) {
            this.gameOrchestrator.menu.playButton.toggleAvailability();
            this.gameOrchestrator.menu.movieButton.toggleAvailability();
            if(this.gameOrchestrator.menu.undoButton.available){
                this.gameOrchestrator.menu.undoButton.toggleAvailability();
            }
            this.gameOrchestrator.updateScore(message);
        }
        else if(message == 0) {
            this.gameOrchestrator.changeState(new ChangePlayerState(this.gameOrchestrator));
            this.gameOrchestrator.state.animateCamera();
        }
    }
}