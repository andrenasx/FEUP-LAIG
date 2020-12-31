class ChangePlayerState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
    }

    animateCamera(){
        this.gameOrchestrator.scene.animateCamera();
    }

    cameraEnd() {
        this.gameOrchestrator.currentPlayer = -this.gameOrchestrator.currentPlayer; // Change current player
        this.updateCurrentPlayer();

        // Switch player and enemy type
        [this.gameOrchestrator.playerType, this.gameOrchestrator.enemyType] = [this.gameOrchestrator.enemyType, this.gameOrchestrator.playerType];

        // Change state according to current type
        if(this.gameOrchestrator.playerType=="Human"){
            if(!this.gameOrchestrator.menu.undoButton.available){
                this.gameOrchestrator.menu.undoButton.toggleAvailability();
            }
            this.gameOrchestrator.changeState(new CheckMovesState(this.gameOrchestrator));
        }   
        else{
            this.gameOrchestrator.changeState(new BotState(this.gameOrchestrator));
        }
            
    }

    // Change current player in html
    updateCurrentPlayer() {
        let p = this.gameOrchestrator.currentPlayer==1 ? 'Red' : 'Blue';
        document.getElementById('player').innerText = p;
    }
}