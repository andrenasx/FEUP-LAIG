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
            this.updateScore(message);
            this.gameOrchestrator.changeState(new GameOverState(this.gameOrchestrator));
        }
        else if(message == -1) {
            console.log("Blue player won");
            this.updateScore(message);
            this.gameOrchestrator.changeState(new GameOverState(this.gameOrchestrator));
        }
        else if(message == 0) {
            console.log("No winners yet");
            this.updateScore(message);
            this.gameOrchestrator.changeState(new ChangePlayerState(this.gameOrchestrator));
            this.gameOrchestrator.state.animateCamera();
        }
    }

    updateScore(message) {
        if(message == 1) {
            document.getElementById('red-score').innerHTML = parseInt(document.getElementById('red-score').innerHTML) + 1;
        }
        else if (message == -1) {
            document.getElementById('blue-score').innerHTML = parseInt(document.getElementById('blue-score').innerHTML) + 1;
        }
    }
}