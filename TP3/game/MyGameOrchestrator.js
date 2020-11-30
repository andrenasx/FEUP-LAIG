class MyGameOrchestrator extends CGFobject {
    constructor(scene){
        super(scene);

        this.gameboard = new MyGameBoard(scene, 8);

        this.lastPickedID = null;
    }

    display(){
        this.gameboard.display();
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
            if(this.lastPickedID==null) this.lastPickedID = id;
            else {
                this.gameboard.movePiece(this.lastPickedID, id);
                this.lastPickedID = null;
            }
        }
        else {
            console.log('What you doin?')
        }
    }
}