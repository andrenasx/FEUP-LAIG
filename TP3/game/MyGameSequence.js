class MyGameSequence {
    constructor(gameOrchestrator){
        this.gameOrchestrator = gameOrchestrator;
        this.sequence = [];
        this.current_move = null;
    }

    addGameMove(gameMove){
        this.sequence.push(gameMove);
        this.current_move = this.sequence.length-1;
    }

    update(delta){
        this.current_move=0;
        for(let move of this.sequence){
            move.update(delta);
            if(move.finished){
                this.gameOrchestrator.state.animationEnd();
                this.current_move++;
            }
        }
    }

    getCurrentMove(){
        if(this.sequence.length!==0) return this.sequence[this.current_move];
    }
}