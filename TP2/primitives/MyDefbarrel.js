/**
 * MyDefbarrel
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {float} base - radius of the base
 * @param {float} middle - center of the base
 * @param {float} height - height of the barrel
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

        let h = 4 / 3 * this.base;
        let H = 4 / 3 * (this.middle - this.base);
        
        let middleX = (this.base + H);
        let middleY = (4/3) * middleX;
        let Q2Z = this.height/3;
        let Q3Z = this.height*2/3;
        
        let controlPoints = [
            //P4
            [
                [this.base, 0, 0, 1],           //Q1
                [middleX, 0, Q2Z, 1],           //Q2
                [middleX, 0, Q3Z, 1],           //Q3
                [this.base, 0, this.height, 1]  //Q4
            ],
            //P3
            [
                [this.base, h, 0, 1],           //Q1
                [middleX, middleY, Q2Z, 1],     //Q2
                [middleX, middleY, Q3Z, 1],     //Q3
                [this.base, h, this.height, 1]  //Q4
            ],
            //P2
            [
                [-this.base, h, 0, 1],          //Q1
                [-middleX, middleY, Q2Z, 1],    //Q2
                [-middleX, middleY, Q3Z, 1],    //Q3
                [-this.base, h, this.height, 1] //Q4
            ],
            //P1
            [
                [-this.base, 0, 0, 1],          //Q1
                [-middleX, 0, Q2Z, 1],          //Q2
                [-middleX, 0, Q3Z, 1],          //Q3
                [-this.base, 0, this.height, 1] //Q4
            ]
        ];

        this.defbarrel = new MyPatch(this.scene, this.stacks, this.slices, 4, 4, controlPoints);
    }
    
    display() {
        //Top half
        this.defbarrel.display();

        //Lower half
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0,0,1);
        this.defbarrel.display();
        this.scene.popMatrix();
	}
}