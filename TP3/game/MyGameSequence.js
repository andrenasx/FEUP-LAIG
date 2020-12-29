class MyGameSequence {
    constructor(gameOrchestrator){
        this.gameOrchestrator = gameOrchestrator;
        this.sequence = [];
        this.current_move = 0;
        this.lastmoveType = 2;
        this.undoflag = false;
    }

    addGameMove(gameMove){
        this.sequence.push(gameMove);
    }

    update(deltaTime){
        if(this.current_move==this.sequence.length || this.sequence.length==0) return;

        let move = this.getCurrentMove();
        move.update(deltaTime);
        if(move.finished) this.current_move++;

        if(this.sequence[this.sequence.length-1].finished){
            this.gameOrchestrator.state.animationEnd();
            if(this.undoflag){
                this.undoflag = false;
                for(let i=0; i<this.lastmoveType; i++){
                    this.sequence.pop();
                    this.current_move--;
                }
            }
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

    undo(){
        let moves;
        if(this.sequence.length!==0){
            if(this.lastmoveType == 1){
                moves = [this.sequence.pop()];
                this.current_move--;
            } 
            else{
                moves = [this.sequence.pop(), this.sequence.pop()];
                this.current_move-=2;
            }

            this.undoflag = true;

            for(let move of moves){
                this.addGameMove(new MyGameMove(move.moveTile, move.selectedTile, this.gameOrchestrator.scene));
            }
        }
    }

    movie(){
        for(let move of this.sequence){
            move.resetAnimation()
        }
        this.current_move=0;
    }
}