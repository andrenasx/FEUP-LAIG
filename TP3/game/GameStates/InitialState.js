class InitialState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
    }

    pickObj(id) {
        if(id==101){
            this.gameOrchestrator.play();
            document.getElementById("time").innerHTML = "";
        }
    }
}