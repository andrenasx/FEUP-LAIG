class MySpritesheet extends CGFobject {
	constructor(scene, texture, sizeM, sizeN) {
		super(scene);
        this.texture = texture;
        this.sizeM = sizeM;
        this.sizeN = sizeN;

        this.resizeM = 1/sizeM;
        this.resizeN = 1/sizeN;

        this.shader = new CGFshader(this.scene.gl, "./spritesheets/shaders/shader.vert", "./spritesheets/shaders/shader.frag");
        this.shader.setUniformsValues({uSampler: 0});
    }

    setUniValues(){
        this.shader.setUniformsValues({resizeM: this.resizeM});
        this.shader.setUniformsValues({resizeN: this.resizeN});

        this.texture.bind(0);
        this.scene.setActiveShaderSimple(this.shader);
    }

    activateCellMN(m, n){
        this.shader.setUniformsValues({shiftM: m*this.resizeM});
        this.shader.setUniformsValues({shiftN: n*this.resizeN});
    }

    activateCellP(p){
        this.activateCellMN(p % this.sizeM, Math.floor(p / this.sizeM));
    }
}