class ChangePlayerState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
    }

    animateCamera(){
        this.gameOrchestrator.scene.animateCamera();
    }

    pickTile(tile) {
        //no picking, game is animating
    }

    animationEnd() {
        this.gameOrchestrator.currentPlayer = -this.gameOrchestrator.currentPlayer;
        [this.gameOrchestrator.playerType, this.gameOrchestrator.enemyType] = [this.gameOrchestrator.enemyType, this.gameOrchestrator.playerType];
        if(this.gameOrchestrator.playerType=="Player")
            this.gameOrchestrator.changeState(new CheckMovesState(this.gameOrchestrator));
        else
            this.gameOrchestrator.changeState(new BotState(this.gameOrchestrator));
    }

    receivedReply(message) {
    }
}