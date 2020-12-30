class MyAuxiliarBoard extends CGFobject {
    constructor(scene, size){
        super(scene);
        this.size = size;
        this.x = -2;
        this.y = 0; 
        this.z = 0.5;

        this.tile = new MyPlane(scene, 5, 5);

        this.init()
    }

    init(){
        this.pieces = [];
    }

    display(){
        for(let i=0; i<this.size; i++) {
            this.scene.pushMatrix();
            this.scene.translate(this.x,0,this.z+i)
            this.tile.display();
            this.scene.popMatrix();
        }

        this.displayPieces()
    }

    displayPieces(){
        let y=0, z=0;
        for(let p=0; p<this.pieces.length; p++){
            this.scene.pushMatrix();
            this.scene.translate(this.x,y,this.z+z)
            this.pieces[p].display();
            this.scene.popMatrix();

            z+=1
            if(z==this.size){
                z=0;
                y+=0.21;
            }
        }
    }

    setPiece(piece){
        this.pieces.push(piece);
    }

    getPiece(){
        return this.pieces[this.pieces.length-1];
    }

    removePiece(){
        this.pieces.pop();
    }

    getPosition(){
        let y=0, z=0;
        for(let p=0; p<this.pieces.length; p++){
            z+=1
            if(z==this.size){
                z=0;
                y+=0.21;
            }
        }

        return this.nextposition = {x:this.x, y:y, z:this.z+z}
    }
}