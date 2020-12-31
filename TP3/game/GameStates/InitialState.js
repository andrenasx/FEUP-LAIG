class InitialState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
    }

    pickObj(id) {
        if(id==101){
            // Start game when play button is pressed
            this.gameOrchestrator.play();
            document.getElementById("time").innerHTML = "";
        }
    }
}