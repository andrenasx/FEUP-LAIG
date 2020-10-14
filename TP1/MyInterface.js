/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    createInterface() {
        this.createAxisCheckbox();
        this.createCamerasDropdown();
    }

    createAxisCheckbox() {
        this.gui.add(this.scene, 'displayAxis').name('Display Axis');
    }

    createCamerasDropdown() {
        const group = this.gui.addFolder("Views");
        group.open();

        this.scene.selectedCamera = this.scene.graph.viewsDefaultID;

        group.add(this.scene, 'selectedCamera', Object.keys(this.scene.graph.views)).name('Cameras').onChange(this.scene.updateCamera.bind(this.scene));
    }
}