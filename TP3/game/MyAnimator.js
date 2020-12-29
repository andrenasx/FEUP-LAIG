class MyAnimator {
    constructor(gameSequence){
        this.gameSequence = gameSequence;
        this.frame = 0;
    }

    update(delta){
        this.gameSequence.update(delta);
    }

    display(){
        let move = this.gameSequence.getCurrentMove();
        if(move) move.animate();
    }
}