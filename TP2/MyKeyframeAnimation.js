class MyKeyframeAnimation extends MyAnimation{
    constructor(keyframes){
        this.keyframes = keyframes;
        super(keyframes[0].instant, keyframes[keyframes.length-1].instant, keyframes[0].transformation, keyframes[keyframes.length-1].transformation);
    }
}