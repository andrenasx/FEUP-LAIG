class MySpritesheet extends CGFobject {
	constructor(scene, texture, sizeM, sizeN) {
		super(scene);
        this.texture = texture;
        this.sizeM = sizeM;
        this.sizeN = sizeN;

        this.shader = new CGFshader(this.scene.gl, "./spritesheets/shaders/shader.vert", "./spritesheets/shaders/shader.frag");
        this.shader.setUniformsValues({cols:this.sizeM});
        this.shader.setUniformsValues({rows:this.sizeN});
        this.shader.setUniformsValues({uSampler:0});
    }

    activateCellMN(m, n){
        this.shader.setUniformsValues({m:m});
        this.shader.setUniformsValues({n:n});
    }

    activateCellP(p){
        this.activateCellMN(p % this.sizeM, Math.floor(p / this.sizeM));
    }
}