class MyAnimation {
    constructor(startTime, endTime, startTransf, endTransf) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.startTransf = startTransf;
        this.endTransf = endTransf;

        this.elapsedTime = 0;
        this.finished = false;

        this.startTransl = this.startTransf[0];
        this.startRot = [this.startTransf[1], this.startTransf[2], this.startTransf[3]];
        this.startScale = this.startTransf[4];

        this.endTransl = this.endTransf[0];
        this.endRot = [this.endTransf[1], this.endTransf[2], this.endTransf[3]];
        this.endScale = this.endTransf[4];

        this.currentTransl = vec3.create();
        this.currentRot = vec3.create();
        this.currentScale = vec3.create();

        this.animationMatrix = mat4.create();

        if(startTime==0) this.calculateAnimMatrix();
    }

    update(deltaTime){
        this.elapsedTime += deltaTime;

        if(this.elapsedTime>=this.startTime && !this.finished) {
            this.calculateAnimMatrix();
        }
    }

    calculateAnimMatrix(){
        let percentTime = this.elapsedTime/this.endTime;
        if(percentTime >= 1) {
            this.finished = true;
            percentTime = 1;
        }

        vec3.lerp(this.currentTransl, this.startTransl, this.endTransl, percentTime);
        vec3.lerp(this.currentRot, this.startRot, this.endRot, percentTime);
        vec3.lerp(this.currentScale, this.startScale, this.endScale, percentTime);
    }

    apply(scene){
        mat4.identity(this.animationMatrix);
        mat4.translate(this.animationMatrix, this.animationMatrix, this.currentTransl);
        mat4.rotate(this.animationMatrix, this.animationMatrix, this.currentRot[0], [1,0,0]);
        mat4.rotate(this.animationMatrix, this.animationMatrix, this.currentRot[1], [0,1,0]);
        mat4.rotate(this.animationMatrix, this.animationMatrix, this.currentRot[2], [0,0,1]);
        mat4.scale(this.animationMatrix, this.animationMatrix, this.currentScale);

        scene.multMatrix(this.animationMatrix);
    }
}