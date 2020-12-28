class MyPiece extends CGFobject {
    constructor(scene, player){
        super(scene);
        this.player = player;
        this.piece = new MyCylinder(scene, 0.2, 0.45, 0.45, 5, 30);

        this.material= new CGFappearance(scene);
        if(player==1){
            this.material.setShininess(5);
            this.material.setEmission(0, 0, 0, 1);
            this.material.setAmbient(0.1, 0, 0, 1);
            this.material.setDiffuse(1, 0, 0, 1),
            this.material.setSpecular(0, 0, 0, 1);
        }
        else if(player==-1){
            this.material.setShininess(1);
            this.material.setEmission(0, 0, 0, 1);
            this.material.setAmbient(0, 0, 0.1, 1);
            this.material.setDiffuse(0, 0, 1, 1),
            this.material.setSpecular(0, 0, 0, 1);
        }

        this.highlight_material = new CGFappearance(scene);
        this.highlight_material.setShininess(5);
        this.highlight_material.setEmission(0, 0, 0, 1);
        this.highlight_material.setAmbient(0.1, 0.1, 0.1, 1);
        this.highlight_material.setDiffuse(1, 1, 1, 1),
        this.highlight_material.setSpecular(0.5, 0.5, 0.5, 1);

        this.current_material = this.material;
    }

    display(){
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 1,0,0);
        this.current_material.apply();
        this.piece.display();
        this.scene.popMatrix();
    }

    highlightPiece(){
        this.current_material = this.highlight_material;
    }

    unlightPiece(){
        this.current_material = this.material;
    }
}