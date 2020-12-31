class MovieState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
    }

    animationEnd() {
        // When movie is finished change to initial State again
        this.gameOrchestrator.menu.playButton.toggleAvailability();
        this.gameOrchestrator.changeState(new InitialState(this.gameOrchestrator));
    }
}