class GameOverState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
        gameOrchestrator.replay();
    }

    pickTile(tile) {
        // no picking
    }

    animationEnd() {
        console.log("End of replay")
    }

    receivedReply(message) {
        // no replies
    }
}