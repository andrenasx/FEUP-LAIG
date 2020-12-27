class MyGameSequence {
    constructor(gameOrchestrator){
        this.gameOrchestrator = gameOrchestrator;
        this.sequence = [];
        this.current_move = 0;
    }

    addGameMove(gameMove){
        this.sequence.push(gameMove);
    }

    update(delta){
        if(this.current_move==this.sequence.length || this.sequence.length==0) return;

        for (let i = this.current_move; i < this.sequence.length; i++) {
            let move = this.sequence[i];
            move.update(delta);
        }

        if(this.getLastMove().finished){
            this.current_move = this.sequence.length;
            this.gameOrchestrator.state.animationEnd();
        }
    }

    getCurrentMove(){
        if(this.sequence.length!==0) return this.sequence[this.current_move];
    }

    getCurrentMoves(){
        return this.sequence.slice(this.current_move, this.sequence.length);
    }

    getLastMove(){
        if(this.sequence.length!==0) return this.sequence[this.sequence.length-1];
    }
}