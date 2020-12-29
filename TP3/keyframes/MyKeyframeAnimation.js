class MyKeyframeAnimation {
    constructor(keyframes){
        this.keyframes = keyframes;
        this.frame = 1;
        this.elapsedTime = 0;
        this.finished = false;
        this.initialAnimation()
    }

    initialAnimation(){
        if(this.keyframes.length === 1)
            this.activeAnimation = new MyAnimation(this.keyframes[0].instant, this.keyframes[0].instant, this.keyframes[0].transformations, this.keyframes[0].transformations);
        else
            this.activeAnimation = new MyAnimation(this.keyframes[0].instant, this.keyframes[1].instant, this.keyframes[0].transformations, this.keyframes[1].transformations);
    }

    apply(scene){
        this.activeAnimation.apply(scene);
    }

    update(deltaTime){
        if(this.frame === this.keyframes.length){
            return;
        }

        this.elapsedTime += deltaTime;

        if(this.elapsedTime > this.keyframes[this.frame].instant){
            if(this.activeAnimation.finished){
                this.frame++;
                
                if(this.frame === this.keyframes.length){
                    this.finished = true;
                    return;
                }
                
                this.activeAnimation = new MyAnimation(0, this.keyframes[this.frame].instant-this.keyframes[this.frame-1].instant, this.keyframes[this.frame-1].transformations, this.keyframes[this.frame].transformations);
            }
        }

        this.activeAnimation.update(deltaTime);
    }

    reset(){
        this.frame = 1;
        this.elapsedTime = 0;
        this.finished = false;
        this.initialAnimation()
    }
}

