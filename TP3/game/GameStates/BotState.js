class BotState extends GameState {
    constructor(gameOrchestrator){
        super(gameOrchestrator);

        //Choose a play
        this.gameOrchestrator.prolog.botPlay(gameOrchestrator.playerType);
    }

    receivedReply(message) {
        if(message.length==4){
            // Length is 4, piece move
            this.gameOrchestrator.performBotMove(message[0],message[1],message[2],message[3]);
            this.gameOrchestrator.changeState(new CheckGameOverState(this.gameOrchestrator));
        }
        else if(message.length==2){
            // Length is 2, only a piece remove
            this.gameOrchestrator.performBotRemove(message[0],message[1]);
            this.gameOrchestrator.changeState(new CheckGameOverState(this.gameOrchestrator));
        }
    }
}