class MyButton extends CGFobject {
    constructor(scene, text) {
        super(scene);
        this.text = text;
        this.cube = new MyCube(this.scene);
        this.buttonText = new MySpriteText(this.scene, this.text);

        //Materials

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

        this.selectedMaterial = this.lightgreyMaterial;
        this.available = false;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(0.45, 0.1, 0.2);
        this.selectedMaterial.apply();
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.11);
        this.scene.scale(0.08, 0.06, 1);
        this.buttonText.display();
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