class InitialState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
    }

    pickObj(id) {
        if(id==101){
            console.log("here");
            this.gameOrchestrator.menu.available = false;
            this.gameOrchestrator.menu.toggleAvailability();
            this.gameOrchestrator.play();
            document.getElementById("time").innerHTML = "";
        }
    }
}