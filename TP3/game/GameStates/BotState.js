class BotState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);
        this.gameOrchestrator.prolog.botPlay(gameOrchestrator.playerType);
    }

    pickTile(tile) {
    }

    animationEnd() {
        //no game animations
    }

    receivedReply(message) {
        if(message.length==4){
            this.gameOrchestrator.performBotMove(message[0],message[1],message[2],message[3]);
            this.gameOrchestrator.changeState(new CheckGameOverState(this.gameOrchestrator));
        }
        else if(message.length==2){
            this.gameOrchestrator.performBotRemove(message[0],message[1]);
            this.gameOrchestrator.changeState(new CheckGameOverState(this.gameOrchestrator));
        }
    }
}