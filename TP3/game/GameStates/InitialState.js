class InitialState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
    }

    pickObj(id) {
        if(id==101) {
            this.gameOrchestrator.menu.playButton.toggleAvailability();
            // Start game when play button is pressed
            this.gameOrchestrator.play();
            document.getElementById("time").innerHTML = "";
        }
        else if (id==102) {
            this.gameOrchestrator.menu.playButton.toggleAvailability();
            this.gameOrchestrator.menu.movieButton.toggleAvailability();
            this.gameOrchestrator.movie();
        }
    }
}