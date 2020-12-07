class MyGameOrchestrator {
    constructor(scene){
        this.scene = scene;

        this.gameSequence = new MyGameSequence();
        this.animator = new MyAnimator(this, this.gameSequence);
        this.gameboard = new MyGameBoard(scene, 8);

        this.lastPickedID = null;
    }

    update(delta){
        this.animator.update(delta);
    }

    display(){
        this.gameboard.display();
        this.animator.display();
    }

    managePick(mode, pickResults) {
        if (mode == false){
            if (pickResults != null && pickResults.length > 0) {
                for (var i=0; i< pickResults.length; i++) {
                    var obj = pickResults[i][0]; // get object from result
                    if (obj) {
                        var uniqueId = pickResults[i][1] // get id
                        this.onObjectSelected(obj, uniqueId);
                    }
                }
                // clear results
                pickResults.splice(0, pickResults.length);
            }
        }
    }

    onObjectSelected(obj, id) {
        if(obj instanceof MyTile){
            if(obj.getPiece()==null){
                this.lastPickedID = null;
            }
            else{
                if(this.lastPickedID==null) this.lastPickedID = id-1;
                else {
                    this.selectedTile = this.gameboard.getTileByID(this.lastPickedID);
                    this.moveTile = this.gameboard.getTileByID(id-1);
                    this.gameSequence.addGameMove(new MyGameMove(this.selectedTile, this.moveTile, this.gameboard));
                    this.lastPickedID = null;
                }
            }
        }
        else {
            console.log('What you doin?')
        }
    }
}