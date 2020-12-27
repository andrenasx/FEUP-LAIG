class MyGameOrchestrator {
    constructor(scene){
        this.scene = scene;

        this.gameSequence = new MyGameSequence(this);
        this.animator = new MyAnimator(this.gameSequence);
        this.prolog = new MyPrologInterface(this);
        this.gameboard = new MyGameBoard(scene);
        this.auxiliarboard = new MyAuxiliarBoard(scene);

        this.currentPlayer = 1;
        this.selectedTile = null;

        this.state = new CheckMovesState(this);
    }

    update(delta){
        this.animator.update(delta);
    }

    display(){
        this.managePick(this.scene.pickMode, this.scene.pickResults);
        this.gameboard.display();
        this.auxiliarboard.display();
        this.animator.display();
    }

    managePick(mode, pickResults) {
        if (mode == false){
            if (pickResults != null && pickResults.length > 0) {
                for (let i=0; i< pickResults.length; i++) {
                    let obj = pickResults[i][0]; // get object from result
                    if (obj instanceof MyTile) {
                        this.state.pickTile(obj);

                        //var uniqueId = pickResults[i][1] // get id
                    }
                }
                // clear results
                pickResults.splice(0, pickResults.length);
            }
        }
    }

    performMove(moveTile){
        this.gameSequence.addGameMove(new MyGameMove(moveTile, this.auxiliarboard.getTile(), this.gameboard));
        this.gameSequence.addGameMove(new MyGameMove(this.selectedTile, moveTile, this.gameboard));
        this.currentPlayer = -this.currentPlayer;
    }

    performRemove(selectedTile){
        this.gameSequence.addGameMove(new MyGameMove(selectedTile, this.auxiliarboard.getTile(), this.gameboard));
        this.currentPlayer = -this.currentPlayer;
    }

    changeState(state){
        this.state = state;
    }

    receivedReply(msg){
        this.state.receivedReply(msg);
    }
}