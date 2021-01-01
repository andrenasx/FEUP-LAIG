class MyAnimatedCamera extends CGFcamera {
    constructor(gameOrchestrator, fov, near, far, position, target) {
        super(fov, near, far, position, target);

        this.gameOrchestrator = gameOrchestrator;
        this.animationTime = 2;
        this.elapsedTime = 0;
        this.angle = 0;
        this.active = false;
    }

    activate(){
        this.elapsedTime = 0;
        this.angle = 0;
        this.active = true;
    }

    disable(){
        this.orbit(CGFcameraAxis.Y, Math.PI-this.angle);
        this.gameOrchestrator.state.cameraEnd();
        this.active = false;
    }

    update(deltaTime){
        if(this.active){
            this.elapsedTime += deltaTime;

            if(this.elapsedTime >= this.animationTime) {
                this.disable();
                return;
            }

            let percentage = Math.min(this.elapsedTime / this.animationTime, 1);
            let animFactor = EasingFunctions.easeInOutCubic(percentage);

            let increment = Math.PI * animFactor - this.angle

            this.orbit(CGFcameraAxis.Y, increment);
            this.angle += increment;
        }
    }
}