class ChangePlayerState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
        console.log("CHange STate")
    }

    animateCamera(){
        this.gameOrchestrator.scene.animateCamera();
    }

    cameraEnd() {
        this.gameOrchestrator.currentPlayer = -this.gameOrchestrator.currentPlayer;
        this.updateCurrentPlayer();
        [this.gameOrchestrator.playerType, this.gameOrchestrator.enemyType] = [this.gameOrchestrator.enemyType, this.gameOrchestrator.playerType];
        if(this.gameOrchestrator.playerType=="Player")
            this.gameOrchestrator.changeState(new CheckMovesState(this.gameOrchestrator));
        else
            this.gameOrchestrator.changeState(new BotState(this.gameOrchestrator));
    }

    updateCurrentPlayer() {
        let p = this.gameOrchestrator.currentPlayer==1 ? 'Red' : 'Blue';
        document.getElementById('player').innerText = p;
    }
}