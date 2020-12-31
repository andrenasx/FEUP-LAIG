class MyGameSequence {
    constructor(gameOrchestrator){
        this.gameOrchestrator = gameOrchestrator;
        this.init();
    }

    init(){
        this.sequence = [];
        this.current_move = 0;
        this.lastmoveType = 2;
        this.undoflag = false;
    }

    // Add a new game move to the sequence
    addGameMove(gameMove){
        this.sequence.push(gameMove);
    }

    update(deltaTime){
        if(this.current_move==this.sequence.length || this.sequence.length==0) return;

        let move = this.getCurrentMove();
        move.update(deltaTime); // Update current move
        if(move.finished) this.current_move++; // If move is finished go to next

        // If last move is finished notify state
        if(this.sequence[this.sequence.length-1].finished){
            this.gameOrchestrator.state.animationEnd();
            if(this.undoflag){
                // If moves are from undo, pop added undo moves from the sequence
                this.undoflag = false;
                for(let i=0; i<this.lastmoveType; i++){
                    this.sequence.pop();
                    this.current_move--;
                }
            }
        }
    }

    // Get sequence current move
    getCurrentMove(){
        if(this.sequence.length!==0) return this.sequence[this.current_move];
    }

    // Get sequence last move
    getLastMove(){
        if(this.sequence.length!==0) return this.sequence[this.sequence.length-1];
    }

    // Undo last added moves
    undo(){
        if(this.sequence.length!==0){
            let moves = [];

            // Pop last added moves
            for(let i=0; i<this.lastmoveType; i++){
                moves.push(this.sequence.pop());
                this.current_move--;
            }

            this.undoflag = true;

            // Add undo moves to the sequence
            for(let move of moves){
                move.reverse();
                this.addGameMove(move);
            }
        }
    }

    // Reset all move animations
    movie(){
        for(let move of this.sequence){
            move.resetAnimation()
        }
        this.current_move=0;
    }

    updateTheme(gameProperties) {
        for(let move of this.sequence){
            move.piece.updateTheme(gameProperties);
        }
    }
}