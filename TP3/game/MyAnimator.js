class MyAnimator {
    constructor(gameSequence){
        this.gameSequence = gameSequence;
        this.frame = 0;
    }

    update(delta){
        this.gameSequence.update(delta);
    }

    display(){
        let moves = this.gameSequence.getCurrentMoves();
        if(moves.length>0){
            for(let move of moves){
                move.animate();
            }
        }
    }
}