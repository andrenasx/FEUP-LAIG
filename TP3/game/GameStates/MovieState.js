class MovieState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
        gameOrchestrator.menu.playButton.makeUnavailable();
        gameOrchestrator.menu.movieButton.makeUnavailable();
    }

    animationEnd() {
        // When movie is finished change to initial State again
        this.gameOrchestrator.changeState(new InitialState(this.gameOrchestrator));
        this.gameOrchestrator.menu.movieButton.makeAvailable();
    }
}