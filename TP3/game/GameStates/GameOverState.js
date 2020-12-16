class GameOverState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
    }

    pickTile(tile) {
        // no picking
    }

    animationEnd() {
        //no game animations
    }

    receivedReply(message) {
        // no replies
    }
}