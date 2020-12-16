class MyAnimator {
    constructor(gameSequence){
        this.gameSequence = gameSequence;
        this.frame = 0;
    }

    update(delta){
        this.gameSequence.update(delta);
    }

    display(){
        let current_move = this.gameSequence.getCurrentMove();
        if(current_move){
            current_move.animate();
        }
    }
}