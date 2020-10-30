class MyKeyframeAnimation extends MyAnimation{
    constructor(keyframes){
        this.start = this.keyframes[0].instant;
        this.frame = 1;
        this.elapsedTime = 0;
        this.isFinished = false;
        this.keyframes = keyframes;
        if(this.keyframes.length === 1)
            this.activeAnimation = new MyAnimation(this.keyframes[this.frame-1].instant, this.keyframes[this.frame-1].instant, this.keyframes[this.frame-1].transformations, this.keyframes[this.frame-1]);
        else
            this.activeAnimation = new MyAnimation(this.keyframes[this.frame-1].instant, this.keyframes[this.frame].instant, this.keyframes[this.frame-1].transformations, this.keyframes[this.frame]);
    }

    apply(scene){
        this.activeAnimation.apply(scene);
    }

    update(delta){
        if(this.frame === this.keyframes.length)
            return;

        this.activeAnimation.update(delta);

        if(this.elapsedTime > this.keyframes[this.frame].instant){
            if(this.activeAnimation.isFinished){
                this.frame++;
                if(this.frame === this.keyframes.length)
                    return;
                
                this.activeAnimation = new MyAnimation(0, this.keyframes[this.frame].instant-this.keyframes[this.frame-1].instant, this.keyframes[this.frame-1].transformations, this.keyframes[this.frame]);
            }
        }
        this.elapsedTime += delta;
    }
}

