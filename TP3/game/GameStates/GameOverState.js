class GameOverState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
        gameOrchestrator.replay();
    }

    animationEnd() {
        console.log("End of replay")
    }
}