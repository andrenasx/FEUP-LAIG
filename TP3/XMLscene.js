/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface, player1, player2, size, time) {
        super();

        this.interface = myinterface;
        this.player1 = player1;
        this.player2 = player2;
        this.size = size;
        this.time = time;
        this.themes = ["Theme1", "Theme2", "Theme3"];
        this.selectedTheme = "Theme1";
        this.filenames = new Map();
        this.themesGraphs = new Map();
        this.filenames.set("Theme1", "scene1.xml").set("Theme2", "LAIG_TP2_T2_G01.xml");
        for(let [key, value] of this.filenames.entries()){
            this.themesGraphs[key] = new MySceneGraph(value, this);
        }
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.displayAxis = false;    // Boolean for axis display
        this.selectedCamera = null; // Stores the ID of the currently selected camera
        this.lightsAux = [];    // Auxiliar map ([lightID, True/False]) to enable or disable lights


        this.loadingProgressObject=new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress=0;

        this.defaultAppearance=new CGFappearance(this);

        this.currentTime = 0;

        // enable picking
		this.setPickEnabled(true);

        this.gameOrchestrator = new MyGameOrchestrator(this, this.player1, this.player2, this.size, this.time);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    /**
     * Changes active camera.
     */
    updateCamera() {
        this.gameOrchestrator.state.cameraEnd()
        this.camera = this.getCurrentTheme().views[this.selectedCamera]; //changes camera to selected one
        if(this.selectedCamera != this.getCurrentTheme().viewsDefaultID){
            this.interface.setActiveCamera(this.camera); //enable to control with mouse
        }
    }

    animateCamera(){
        if(this.selectedCamera == this.getCurrentTheme().viewsDefaultID){
            this.camera.activate();
        }
        else {
            this.gameOrchestrator.state.cameraEnd();
        }
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.lightsAux) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.lightsAux.hasOwnProperty(key)) {
                var graphLight = this.getCurrentTheme().lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);
                this.lights[i].setVisible(false);

                if (this.lightsAux[key]){
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                }
                else{
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }

                this.lights[i].update();

                i++;
            }
        }
    }

    /**
     * Enable or disable lights.
     */
    updateLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the lightsAux map.
        for (var key in this.lightsAux) {
            if (this.lightsAux.hasOwnProperty(key)) {
                if (this.lightsAux[key]){
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                }
                else{
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }

                this.lights[i].update();

                i++;
            }
        }
    }

    getCurrentTheme(){
        return this.themesGraphs[this.selectedTheme];
    }

    updateTheme() {
        this.interface.changeTheme();
        let default_camera = this.getCurrentTheme().views[this.getCurrentTheme().viewsDefaultID];
        this.getCurrentTheme().views[this.getCurrentTheme().viewsDefaultID] = new MyAnimatedCamera(this.gameOrchestrator, default_camera.fov, default_camera.near, default_camera.far, default_camera.position, default_camera.target);
        this.updateCamera();
        this.initLights();
    }

    update(t){
        let time = t / 1000 % 1000;
        if(this.currentTime == 0){
            this.currentTime = time;
        }

        let deltaTime = time - this.currentTime;
        this.currentTime = time;

        this.gameOrchestrator.update(deltaTime);

        if(this.selectedCamera == this.getCurrentTheme().viewsDefaultID){
            this.camera.update(deltaTime);
        }

        if(this.getCurrentTheme().animations != undefined){
            for(let [id, animation] of Object.entries(this.getCurrentTheme().animations)){
                animation.update(deltaTime);
            }
        }
            
        if(this.getCurrentTheme().spriteanims != undefined){
            for(let spriteanim of this.getCurrentTheme().spriteanims){
                spriteanim.update(deltaTime);
            }
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        if(!this.sceneInited){
            this.axis = new CGFaxis(this, this.getCurrentTheme().referenceLength);

            this.gl.clearColor(...this.getCurrentTheme().background);
    
            this.setGlobalAmbientLight(...this.getCurrentTheme().ambient);
    
            this.interface.createGUI();
    
            let default_camera = this.getCurrentTheme().views[this.getCurrentTheme().viewsDefaultID];
            this.getCurrentTheme().views[this.getCurrentTheme().viewsDefaultID] = new MyAnimatedCamera(this.gameOrchestrator, default_camera.fov, default_camera.near, default_camera.far, default_camera.position, default_camera.target);
            this.initLights();
            this.updateCamera();
    
            this.setUpdatePeriod(50);
            this.sceneInited = true;
        }
    }

    managePick(mode, pickResults) {
        if (mode == false){
            if (pickResults != null && pickResults.length > 0) {
                for (let i=0; i< pickResults.length; i++) {
                    let obj = pickResults[i][0]; // get object from result
                    if (obj instanceof MyTile) {
                        this.gameOrchestrator.state.pickTile(obj);
                    }
                    else if (obj) {
                        const customID = pickResults[i][1];
                        this.gameOrchestrator.state.pickObj(customID);
                    }
                }
                // clear results
                pickResults.splice(0, pickResults.length);
            }
        }
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.clearPickRegistration();

        this.pushMatrix();

        for (var i = 0; i < this.lights.length; i++) {
            //this.lights[i].setVisible(true);
            this.lights[i].update();
        }

        if (this.sceneInited) {
            // Draw axis
            if (this.displayAxis)
                this.axis.display();
 
            this.defaultAppearance.apply();

            this.managePick(this.pickMode, this.pickResults);
            this.gameOrchestrator.display();

            // Displays the scene (MySceneGraph function).
            this.getCurrentTheme().displayScene();
        }
        else
        {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}