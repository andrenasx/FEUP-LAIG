class MyMenu extends CGFobject {
    constructor(scene) {
        super(scene);
        this.back = new MyCube(this.scene);
        this.title = new MySpriteText(this.scene, "TALPA");

        //buttons
        this.undoButton = new MyButton(this.scene, "UNDO");
        this.playButton = new MyButton(this.scene, "PLAY");
        this.movieButton = new MyButton(this.scene, "MOVIE");

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

        this.greenMaterial = new CGFappearance(this.scene);
        this.greenMaterial.setShininess(5);
        this.greenMaterial.setEmission(0, 0, 0, 1);
        this.greenMaterial.setAmbient(0.04, 0.58, 0.25, 1);
        this.greenMaterial.setDiffuse(0.04, 0.58, 0.25, 1),
        this.greenMaterial.setSpecular(0, 0, 0, 1);

        this.selectedMaterial = this.greenMaterial;
        this.available = true;

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

        //Undo Button
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.65);
        this.lightgreyMaterial.apply();
        this.scene.registerForPick(100, this.undoButton);
        this.undoButton.display();
        this.scene.popMatrix();

        //Play Button
         this.scene.pushMatrix();
         this.scene.translate(0, -0.17, 0.65);
         this.selectedMaterial.apply();
         this.scene.registerForPick(101, this.playButton);
         this.playButton.display();
         this.scene.popMatrix();

         //Movie Button
         this.scene.pushMatrix();
         this.scene.translate(0, -0.34, 0.65);
         this.lightgreyMaterial.apply();
         this.scene.registerForPick(102, this.movieButton);
         this.movieButton.display();
         this.scene.popMatrix();
    }

    toggleAvailability() {
        this.available = !this.available;
        if(this.available) {
            this.selectedMaterial = this.greenMaterial;
        }
        else {
            this.selectedMaterial = this.lightgreyMaterial;
        }
    }
}