class GameOverState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
    }

    pickObj(id) {
        if(id==101) this.gameOrchestrator.replay()
    }
}