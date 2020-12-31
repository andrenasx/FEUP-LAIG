class InitialState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
        gameOrchestrator.menu.playButton.makeAvailable();
    }

    pickObj(id) {
        if(id==101) {
            // Start game when play button is pressed
            this.gameOrchestrator.play();
            this.gameOrchestrator.menu.playButton.makeUnavailable();
            this.gameOrchestrator.menu.movieButton.makeUnavailable();
            document.getElementById("time").innerHTML = "";
        }
        else if (id==102) {
            this.gameOrchestrator.movie();
        }
    }
}