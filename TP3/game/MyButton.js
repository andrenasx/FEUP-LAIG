class MyButton extends CGFobject {
    constructor(scene, text) {
        super(scene);
        this.text = text;
        this.cube = new MyCube(this.scene);
        this.buttonText = new MySpriteText(this.scene, this.text);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(0.45, 0.1, 0.2);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.11);
        this.scene.scale(0.08, 0.06, 1);
        this.buttonText.display();
        this.scene.popMatrix();
    }
}