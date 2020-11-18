/**
 * MyDefbarrel
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {float} base
 * @param {float} middle
 * @param {float} height
 * @param {integer} slices
 * @param {integer} stacks
 */
class MyDefbarrel extends CGFobject {
	constructor(scene, base, middle, height, slices, stacks) {
        super(scene);
        this.base = base;
        this.middle = middle;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        let angle = Math.PI / 6;
        let h = 4 / 3 * this.base;
        let H = 4 / 3 * (this.middle - this.base);
        let aux = this.height / Math.tan(Math.PI / 3);
        
        let controlPoints = [
            //P1
            [
                [-this.base, 0, this.height, 1], //Q4
                [-this.base - H, 0, this.height - aux, 1], //Q3
                [-this.base - H, 0, aux, 1], //Q2
                [-this.base, 0, 0, 1], //Q1
            ],

            [
                [-this.base, h, this.height, 1],
                [(this.base + H) * Math.cos(Math.PI - angle), Math.sin(Math.PI - angle) * (this.base + h), this.height - aux, 1],
                [(this.base + H) * Math.cos(Math.PI - angle), Math.sin(Math.PI - angle) * (this.base + h), aux, 1],
                [-this.base, h, 0, 1],
            ],

            [
                [this.base, h, this.height, 1],
                [(this.base + H) * Math.cos(angle), Math.sin(angle) * (this.base + h), this.height - aux, 1],
                [(this.base + H) * Math.cos(angle), Math.sin(angle) * (this.base + h), aux, 1],
                [this.base, h, 0, 1],
            ],

            [
                [this.base, 0, this.height, 1],
                [this.base + H, 0, this.height - aux, 1],
                [this.base + H, 0, aux, 1],
                [this.base, 0, 0, 1],
            ],
        ];

        this.defbarrel = new MyPatch(this.scene, this.stacks, this.slices, 3, 3, controlPoints);
    }
    
    display() {
		this.defbarrel.display();
	}
}