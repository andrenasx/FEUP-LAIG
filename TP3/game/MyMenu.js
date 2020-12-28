class MyMenu extends CGFobject {
    constructor(scene) {
        super(scene);
        this.back = new MyCube(this.scene);
        this.title = new MySpriteText(this.scene, "TALPA");

        //buttons
        this.undoButton = new MyButton(this.scene, "UNDO");
        this.pauseButton = new MyButton(this.scene, "PAUSE");

        //Materials
        this.greyMaterial = new CGFappearance(this.scene);
        this.greyMaterial.setShininess(5);
        this.greyMaterial.setEmission(0, 0, 0, 1);
        this.greyMaterial.setAmbient(0.34, 0.35, 0.36, 1);
        this.greyMaterial.setDiffuse(0.34, 0.35, 0.36, 1),
        this.greyMaterial.setSpecular(0, 0, 0, 1);

        this.lightgreyMaterial = new CGFappearance(this.scene);
        this.lightgreyMaterial.setShininess(5);
        this.lightgreyMaterial.setEmission(0, 0, 0, 1);
        this.lightgreyMaterial.setAmbient(0.76, 0.77, 0.8, 1);
        this.lightgreyMaterial.setDiffuse(0.76, 0.77, 0.8, 1),
        this.lightgreyMaterial.setSpecular(0, 0, 0, 1);
    }

    display() {
        //Back
        this.scene.pushMatrix();
        this.greyMaterial.apply();
        this.back.display();
        this.scene.popMatrix();

        //Title
        this.scene.pushMatrix();
        this.scene.translate(0, 0.3, 0.7);
        this.scene.scale(0.1, 0.4, 1);
        this.title.display();
        this.scene.popMatrix(); 

        //Undo Button
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.8);
        this.lightgreyMaterial.apply();
        this.undoButton.display();
        this.scene.popMatrix();

        //Pause Button
         this.scene.pushMatrix();
         this.scene.translate(0, -0.2, 0.8);
         this.lightgreyMaterial.apply();
         this.pauseButton.display();
         this.scene.popMatrix();
    }
}