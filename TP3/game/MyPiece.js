class MyPiece extends CGFobject {
    constructor(scene, player){
        super(scene);
        this.player = player;

        this.highlight_material = new CGFappearance(scene);
        this.highlight_material.setShininess(5);
        this.highlight_material.setEmission(0, 0, 0, 1);
        this.highlight_material.setAmbient(0.04, 0.58, 0.25, 1);
        this.highlight_material.setDiffuse(0.04, 0.58, 0.25, 1),
        this.highlight_material.setSpecular(0, 0, 0, 1);
    }

    display(){
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 1,0,0);
        if(this.piece){
            this.current_material.apply();
            this.piece.display();
        }
        this.scene.popMatrix();
    }

    highlightPiece(){
        this.current_material = this.highlight_material;
    }

    unlightPiece(){
        this.current_material = this.material;
    }

    updateTheme(game){
        this.piece = game['player'+this.player].geometry;
        this.material = game['player'+this.player].material;

        this.current_material = this.material;
    }
}