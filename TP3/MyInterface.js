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

    /**
     * Creates all checkboxes or dropdowns needed for the GUI.
     */
    createGUI() {
        this.createGameFolder();
        this.createThemeDropdown();
        this.createCamerasDropdown();
        this.createLightsCheckbox();
    }

    /**
     * Create theme dropdown.
     */
    createThemeDropdown(){
        const themes = this.gui.addFolder("Themes");
        themes.open();

        themes.add(this.scene, 'selectedTheme', Array.from(this.scene.filenames.keys())).name('Themes').onChange(this.scene.updateTheme.bind(this.scene));
    }

    /**
     * Create camera dropdown and set selectedCamera with views defaultID.
     */
    createCamerasDropdown() {
        this.cameras = this.gui.addFolder("Views");
        this.cameras.open();

        this.scene.selectedCamera = this.scene.getCurrentTheme().viewsDefaultID;

        this.cameras.add(this.scene, 'selectedCamera', Object.keys(this.scene.getCurrentTheme().views)).name('Cameras').onChange(this.scene.updateCamera.bind(this.scene));
    }

    /**
     * Create lights checkbox and add lights enable values to lightsAux map.
     */
    createLightsCheckbox(){
        this.lights = this.gui.addFolder("Lights");

        const lights = this.scene.getCurrentTheme().lights;
        this.scene.lightsAux = [];
        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightsAux[key] = lights[key][0];
                this.lights.add(this.scene.lightsAux, key).onChange(this.scene.updateLights.bind(this.scene));
            }
        }
    }

    createGameFolder(){
        this.game = this.gui.addFolder("Game");
        this.game.open();

        this.createPrologConnection();
        this.createGameConfiguration();
    }

    createPrologConnection(){
        const pl =  this.game.addFolder("Prolog Connection");
        pl.open();

        pl.add({Handshake: () => { this.scene.gameOrchestrator.prolog.handshake()}}, "Handshake");
        pl.add({Quit: () => { this.scene.gameOrchestrator.prolog.quit()}}, "Quit");
    }

    createGameConfiguration(){
        this.gameconf = this.game.addFolder("Game Configuration");
        this.gameconf.open();

        this.gameconf.add(this.scene.gameOrchestrator, 'redplayer', ['Human', 'Easy', 'Normal']).name('Red Player');
        this.gameconf.add(this.scene.gameOrchestrator, 'blueplayer', ['Human', 'Easy', 'Normal']).name('Blue Player');
        this.gameconf.add(this.scene.gameOrchestrator, 'time', 15, 60, 1).name('Max turn time');
    }

    showGameConf(){
        this.gameconf.domElement.hidden = false;
    }

    hideGameConf(){
        this.gameconf.domElement.hidden = true;
    }

    changeTheme(){
        this.gui.removeFolder(this.cameras);
        this.gui.removeFolder(this.lights);
        this.createCamerasDropdown();
        this.createLightsCheckbox();
    }
}