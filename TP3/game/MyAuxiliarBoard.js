class MyAuxiliarBoard extends CGFobject {
    constructor(scene, size){
        super(scene);
        this.size = size;
        this.x = -2;
        this.y = 0; 
        this.z = 0.5;

        this.pieces = [];

        this.cube = new MyCube(scene);

        this.box = new CGFappearance(this.scene);
        this.box.setShininess(5);
        this.box.setEmission(0, 0, 0, 1);
        this.box.setAmbient(1, 1, 1, 1);
        this.box.setDiffuse(0.4, 0.4, 0.4, 1),
        this.box.setSpecular(0.7, 0.7, 0.7, 1);
        this.box.loadTexture("./scenes/images/white_wood.jpg");
        this.box.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
    }

    display(){
        this.box.apply();
        this.scene.pushMatrix();
        this.scene.translate(-2, -0.15, this.size/2);
        this.scene.scale(1, 0.3, this.size);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2, -0.15, -0.05)
        this.scene.scale(1.2, 0.6, 0.1);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2, -0.15, this.size)
        this.scene.scale(1.2, 0.6, 0.1);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1.45, -0.15, this.size/2);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.scene.scale(0.6, 0.1, this.size);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2.55, -0.15, this.size/2);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.scene.scale(0.6, 0.1, this.size);
        this.cube.display();
        this.scene.popMatrix();


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