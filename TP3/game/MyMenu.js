class MyMenu extends CGFobject {
    constructor(scene) {
        super(scene);
        this.back = new MyCube(this.scene);
        this.title = new MySpriteText(this.scene, "TALPA");

        //buttons
        this.undoButton = new MyButton(this.scene, "UNDO");
        this.playButton = new MyButton(this.scene, "PLAY");
        this.movieButton = new MyButton(this.scene, "MOVIE");

        this.greyMaterial = new CGFappearance(this.scene);
        this.greyMaterial.setShininess(5);
        this.greyMaterial.setEmission(0, 0, 0, 1);
        this.greyMaterial.setAmbient(0.34, 0.35, 0.36, 1);
        this.greyMaterial.setDiffuse(0.34, 0.35, 0.36, 1),
        this.greyMaterial.setSpecular(0, 0, 0, 1);

    }

    display() {
        //Back
        this.scene.pushMatrix();
        this.greyMaterial.apply();
        this.back.display();
        this.scene.popMatrix();

        //Title
        this.scene.pushMatrix();
        this.scene.translate(0, 0.3, 0.51);
        this.scene.scale(0.1, 0.4, 1);
        this.title.display();
        this.scene.popMatrix(); 

        //Play Button
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.65);
        this.scene.registerForPick(101, this.playButton);
        this.playButton.display();
        this.scene.popMatrix();

        //Undo Button
        this.scene.pushMatrix();
        this.scene.translate(0, -0.17, 0.65);
        this.scene.registerForPick(100, this.undoButton);
        this.undoButton.display();
        this.scene.popMatrix();

        //Movie Button
        this.scene.pushMatrix();
        this.scene.translate(0, -0.34, 0.65);
        this.scene.registerForPick(102, this.movieButton);
        this.movieButton.display();
        this.scene.popMatrix();

        this.scene.clearPickRegistration();
    }

}