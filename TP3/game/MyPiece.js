class MyPiece extends CGFobject {
    constructor(scene, player){
        super(scene);
        this.player = player;
        this.piece = new MyCylinder(scene, 0.2, 0.45, 0.45, 5, 30);

        this.material= new CGFappearance(scene);
        if(player=='red'){
            this.material.setShininess(5);
            this.material.setEmission(0, 0, 0, 1);
            this.material.setAmbient(0.1, 0, 0, 1);
            this.material.setDiffuse(1, 0, 0, 1),
            this.material.setSpecular(0, 0, 0, 1);
        }
        else if(player=='blue'){
            this.material.setShininess(1);
            this.material.setEmission(0, 0, 0, 1);
            this.material.setAmbient(0, 0, 0.1, 1);
            this.material.setDiffuse(0, 0, 1, 1),
            this.material.setSpecular(0, 0, 0, 1);
        }
    }

    display(){
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 1,0,0);
        this.material.apply();
        this.piece.display();
        this.scene.popMatrix();
    }
}