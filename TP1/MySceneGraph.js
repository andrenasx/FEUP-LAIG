const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var NODES_INDEX = 6;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        const children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if(rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if(referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        // Get id of the default view
        this.viewsDefaultID = this.reader.getString(viewsNode, 'default');
        if (this.viewsDefaultID === null) {
            return "No default view ID defined!";
        }

        // Checks if there are child nodes declared
        const children = viewsNode.children;
        if(children.length === 0) {
            this.onXMLError("No views defined!");
        }

        this.views = [];

        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName !== "perspective" && children[i].nodeName !== "ortho") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">")
                continue
            }

            // Get id of the current view.
            let viewID = this.reader.getString(children[i], 'id');
            if (viewID == null) {
                return "no ID defined for <" + children[i] + ">";
            }

            // Checks for repeated IDs.
            if (this.views[viewID] != null) {
                return "ID must be unique for each view (conflict ID = " + viewID + " )";
            }

            // Checks if view is perspective or ortho and gets components.
            if (children[i].nodeName === "perspective") {
                const near =  this.reader.getFloat(children[i], 'near');
                const far = this.reader.getFloat(children[i], 'far');
                const angle = this.reader.getFloat(children[i], 'angle');

                if (near == null || far == null || angle == null) {
                    return "Missing values for view. View ID: " + viewID;
                }
                if (isNaN(near) || isNaN(far) || isNaN(angle)) {
                    return "Invalid values for view. View ID: " + viewID;
                }

                let from = null;
                let to = null;

                const perspectiveChildren = children[i].children;
                for (let j = 0; j < perspectiveChildren.length; j++) {
                    if (perspectiveChildren[j].nodeName !== "from" && perspectiveChildren[j].nodeName !== "to") {
                        this.onXMLMinorError("unknown tag <" + perspectiveChildren[j].nodeName + ">")
                        continue;
                    }

                    if (perspectiveChildren[j].nodeName === "from") {
                        from = this.parseCoordinates3D(perspectiveChildren[j], "view " + viewID);
                    }
                    else {
                        to = this.parseCoordinates3D(perspectiveChildren[j], "view " + viewID);
                    }
                }

                this.views[viewID] = new CGFcamera(angle * DEGREE_TO_RAD, near, far, vec3.fromValues(from[0], from[1], from[2]), vec3.fromValues(to[0], to[1], to[2]));
            }

            else if (children[i].nodeName === "ortho") {
                const near = this.reader.getFloat(children[i], 'near');
                const far = this.reader.getFloat(children[i], 'far');
                const left = this.reader.getFloat(children[i], 'left');
                const right = this.reader.getFloat(children[i], 'right');
                const top = this.reader.getFloat(children[i], 'top');
                const bottom = this.reader.getFloat(children[i], 'bottom');

                if (near == null || far == null || left == null || right == null || top == null || bottom == null) {
                    return "Missing values for view. View ID: " + viewID;
                }
                if (isNaN(near) || isNaN(far) || isNaN(left) || isNaN(right) || isNaN(top) || isNaN(bottom)) {
                    return "Invalid values for view. View ID: " + viewID;
                }

                let from = null;
                let to = null;
                let up = {
                    x: 0.0,
                    y: 1.0,
                    z: 0.0
                } // optional, default 0,1,0

                const orthoChildren = children[i].children;
                for (let j = 0; j < orthoChildren.length; j++) {
                    if (orthoChildren[j].nodeName !== "from" && orthoChildren[j].nodeName !== "to" && orthoChildren[j].nodeName !== "up") {
                        this.onXMLMinorError("unknown tag <" + orthoChildren[j].nodeName + ">");
                        continue;
                    }

                    if (orthoChildren[j].nodeName === "from") {
                        from = this.parseCoordinates3D(orthoChildren[j], "view with ID: " + viewID);
                    }
                    else if (orthoChildren[j].nodeName === "to") {
                        to = this.parseCoordinates3D(orthoChildren[j], "view with ID: " + viewID);
                    }
                    else {
                        up = this.parseCoordinates3D(orthoChildren[j], "view with ID: " + viewID);
                    }
                }

                this.views[viewID] = new CGFcameraOrtho(left, right, bottom, top, near, far, vec3.fromValues(from[0], from[1], from[2]), vec3.fromValues(to[0], to[1], to[2]), vec3.fromValues(up[0], up[1], up[2]));
            }
        }

        this.log("Parsed Views.");
        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {
        const children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        const children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean","position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed Lights.");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        const children = texturesNode.children;

        this.textures = [];

        //For each texture in textures block, check ID and file URL

        // Checks if there are child nodes declared
        if(children.length === 0) {
            this.onXMLMinorError("No textures defined!");
            return null;
        }

        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current texture
            const textureID = this.reader.getString(children[i], 'id')
            if (this.textures[textureID] != null) {
                return "ID must be unique for each texture (conflict: ID = " + textureID + ")";
            }

            // Get path and create texture
            const file = this.reader.getString(children[i], 'path');
            if (file.includes('scenes/images')) {
                this.textures[textureID] = new CGFtexture(this.scene, file);
            }
            else if (file.includes('images/')) {
                this.textures[textureID] = new CGFtexture(this.scene, './scenes/' + file);
            }
            else {
                this.textures[textureID] = new CGFtexture(this.scene, "./scenes/images/" + file);
            }
        }
        
        this.log("Parsed Textures.");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        const children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];

        // Checks if there are child nodes declared
        if(children.length === 0) {
            this.onXMLMinorError("No materials defined!");
            return null;
        }

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            //Parsing
            grandChildren = children[i].children;

            let nodeNames = [];
            for (let j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            //Get index on XML
            const shininessIndex = nodeNames.indexOf("shininess");
            const ambientIndex = nodeNames.indexOf("ambient");
            const diffuseIndex = nodeNames.indexOf("diffuse");
            const specularIndex = nodeNames.indexOf("specular");
            const emissiveIndex = nodeNames.indexOf("specular");

            //  Checks if all material components are declared.
            if (shininessIndex === -1 || emissiveIndex === -1 || ambientIndex === -1 || diffuseIndex === -1 || specularIndex === -1 || emissiveIndex === -1 ) {
                this.onXMLError("Missing components for material. Material ID: " + materialID);
            }

            //  Checks if shininess has wrong value or is bellow 1, defining 1 as default.
            let shininess = this.reader.getFloat(grandChildren[shininessIndex], "value");
            if (!(shininess != null && !isNaN(shininess))) {
                this.onXMLMinorError("Wrong value for shininess. Material ID: " + materialID);
                shininess = 1;
            }
            if (shininess < 1) {
                this.onXMLMinorError("Shininess value must be 1 or above, provided (" + shininess + "). Assuming 1 as default. Material ID: " + materialID);
                shininess = 1;
            }

            // Parses the rest of the material components.
            const emissive = this.parseColor(grandChildren[emissiveIndex], "emissive component of material. Material ID: " + materialID);
            const ambient = this.parseColor(grandChildren[ambientIndex], "ambient component of material. Material ID: " + materialID);
            const diffuse = this.parseColor(grandChildren[diffuseIndex], "diffuse component of material. Material ID: " + materialID);
            const specular = this.parseColor(grandChildren[specularIndex], "specular component of material. Material ID: " + materialID);

            //Creates a new material and sets parsed components.
            this.materials[materialID] = new CGFappearance(this.scene);
            this.materials[materialID].setShininess(shininess);
            this.materials[materialID].setEmission(emissive[0], emissive[1], emissive[2], emissive[3]);
            this.materials[materialID].setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
            this.materials[materialID].setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
            this.materials[materialID].setSpecular(specular[0], specular[1], specular[2], specular[3]);
        }

        this.log("Parsed Materials.");
        return null;
    }

    /**
   * Parses the <nodes> block.
   * @param {nodes block element} nodesNode
   */
  parseNodes(nodesNode) {
        const children = nodesNode.children;

        this.nodes = [];

        var grandChildren = [];

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null)
                return "no ID defined for nodeID";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            grandChildren = children[i].children;

            let nodeNames = [];
            for (let j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            //Get index on XML
            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");

            // Transformations
            let transformationsMatrix = mat4.create(); //Base matrix

            if (transformationsIndex == -1) {
                this.onXMLMinorError("No <transformations> node declared. Assuming no transformations for this node. Node ID: " + nodeID);
            }
            else {
                const transformationsNode = grandChildren[transformationsIndex].children;
                for (let j = 0; j < transformationsNode.length; j++){
                    // Check transformation
                    switch (transformationsNode[j].nodeName) {
                        case ("translation") :
                            let xyz = null;

                            //Gets values
                            xyz = this.parseCoordinates3D(transformationsNode[j], "node with ID: " + nodeID);

                            //Multiplies new translation matrix
                            mat4.translate(transformationsMatrix, transformationsMatrix, xyz);
                            break;

                        case ("rotation"):
                            //Gets values
                            const axis = this.reader.getString(transformationsNode[j], 'axis');
                            const angle = this.reader.getFloat(transformationsNode[j], 'angle');

                            //Checks for errors
                            if (axis == null || (axis !== "x" && axis !== "y" && axis !== "z")) {
                                return "Wrong value for axis on rotation. Node id: " + nodeID;
                            }
                            if (angle == null || isNaN(angle)) {
                                return "Wrong value for angle on rotation. Node id: " + nodeID;
                            }

                            //Multiplies new rotation matrix
                            mat4.rotate(transformationsMatrix, transformationsMatrix, angle*DEGREE_TO_RAD, this.axisCoords[axis]);
                            break;

                        case ("scale"):
                            //Gets values
                            const sx = this.reader.getFloat(transformationsNode[j], "sx");
                            const sy = this.reader.getFloat(transformationsNode[j], "sy");
                            const sz = this.reader.getFloat(transformationsNode[j], "sz");

                            //Checks for errors
                            if (sx == null || sy == null || sz == null) {
                                return "Missing values for scale. Node id: " + nodeID
                            }
                            if (isNaN(sx) || isNaN(sy) || isNaN(sz)) {
                                return "Wrong values for scale. Node id: " + nodeID
                            }

                            //Multiplies new scale matrix
                            mat4.scale(transformationsMatrix, transformationsMatrix, [sx, sy, sz]);
                            break;
                        default:
                            break;
                    }
                }
            }

            // Material
            const materialID = this.reader.getString(grandChildren[materialIndex], "id");
            if (materialID == null) {
                this.onXMLMinorError("Material ID is not valid. Node ID: " + nodeID);
            }
            if (materialID !== "null") {
                if (this.materials[materialID] == null) {
                    this.onXMLMinorError("Material with ID: " + materialID + " does not exist. Error on node ID: " + nodeID);
                }
            }

            // Texture
            const textureID = this.reader.getString(grandChildren[textureIndex], "id");
            if (textureID == null) {
                this.onXMLMinorError("Texture ID is not valid. Node ID: " + nodeID);
            }
            if (textureID !== "null" && textureID !== "clear") {
                if (this.textures[textureID] == null) {
                    this.onXMLMinorError("Texture with ID: " + textureID + " does not exist. Error on node ID: " + nodeID);
                }
            }

            const amplificationNode = grandChildren[textureIndex].children;
            let amplification = {
                afs: 1,
                aft: 1
            }
            for (let j = 0; j < amplificationNode.length; j++) {
                if (amplificationNode[j].nodeName === "amplification") {
                    const afs = this.reader.getFloat(amplificationNode[j], 'afs');
                    const aft = this.reader.getFloat(amplificationNode[j], 'aft');
                    if (aft == null || afs == null || isNaN(aft) || isNaN(afs)) {
                        this.onXMLMinorError("Amplification values not valid, assuming 1.0. Node ID: " + nodeID);
                    }
                    else {
                        amplification = {
                            afs: afs,
                            aft: aft
                        }
                    }
                }
            }

            // Descendants
            const descendantsNodes = grandChildren[descendantsIndex].children;
            if (descendantsNodes.length === 0) {
                return "No descendants defined! Node id: " + nodeID;
            }

            const childNodesID = [];
            const leafs = [];
            
            for (let j = 0; j < descendantsNodes.length; j++) {
                if (descendantsNodes[j].nodeName === "noderef") {
                    const descendantID = this.reader.getString(descendantsNodes[j], "id");

                    if (descendantID == null)
                        return "Undefined ID for descendant. Node id: " + nodeID;
                    else if (descendantID === nodeID)
                        return "Duplicated node id: " + nodeID;

                    childNodesID.push(descendantID);
                }
                else if (descendantsNodes[j].nodeName === "leaf") {
                    const type = this.reader.getString(descendantsNodes[j], "type", ['triangle', 'rectangle', 'cylinder', 'sphere', 'torus']);
                    // Check leaf type, get values and create primitive object
                    switch (type) {
                        case ("rectangle"):
                            const x1_r = this.reader.getFloat(descendantsNodes[j], 'x1');
                            const y1_r = this.reader.getFloat(descendantsNodes[j], 'y1');
                            const x2_r = this.reader.getFloat(descendantsNodes[j], 'x2');
                            const y2_r = this.reader.getFloat(descendantsNodes[j], 'y2');

                            if (x1_r == null || x2_r == null || y1_r == null || y2_r == null) {
                                return "Missing values for rectangle leaf. Node id: " + nodeID;
                            }
                            if (isNaN(x1_r) || isNaN(x2_r) || isNaN(y1_r) || isNaN(y2_r)) {
                                return "Invalid values for rectangle leaf. Node id: " + nodeID;
                            }

                            const rect = new MyRectangle(this.scene, x1_r, y1_r, x2_r, y2_r);
                            rect.applyTextures(amplification.afs, amplification.aft);

                            leafs.push(rect);
                            break;

                        case ("triangle"):
                            const x1 = this.reader.getFloat(descendantsNodes[j], 'x1');
                            const y1 = this.reader.getFloat(descendantsNodes[j], 'y1');
                            const x2 = this.reader.getFloat(descendantsNodes[j], 'x2');
                            const y2 = this.reader.getFloat(descendantsNodes[j], 'y2');
                            const x3 = this.reader.getFloat(descendantsNodes[j], 'x3');
                            const y3 = this.reader.getFloat(descendantsNodes[j], 'y3');

                            if (x1 == null || x2 == null || y1 == null || y2 == null || x3 == null || y3 == null ) {
                                return "Missing values for triangle leaf. Node id: " + nodeID;
                            }
                            if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2) || isNaN(x3) || isNaN(y3)) {
                                return "Invalid values for triangle leaf. Node id: " + nodeID;
                            }

                            const triangle = new MyTriangle(this.scene, x1, y1, x2, y2, x3, y3);
                            triangle.applyTextures(amplification.afs, amplification.aft);

                            leafs.push(triangle);
                            break;

                        case ("cylinder"):
                            const height = this.reader.getFloat(descendantsNodes[j],'height');
                            const topRadius = this.reader.getFloat(descendantsNodes[j],'topRadius');
                            const bottomRadius = this.reader.getFloat(descendantsNodes[j],'bottomRadius');
                            const stacks_c = this.reader.getInteger(descendantsNodes[j],'stacks');
                            const slices_c = this.reader.getInteger(descendantsNodes[j],'slices');

                            if (height==null || topRadius==null || bottomRadius==null || stacks_c==null || slices_c==null) {
                                return "Missing values for cylinder leaf. Node id: " + nodeID;
                            }
                            else if (isNaN(height) || isNaN(topRadius) || isNaN(bottomRadius) || isNaN(stacks_c) || isNaN(slices_c)) {
                                return "Invalid values for cylinder leaf. Node id: " + nodeID;
                            }

                            leafs.push(new MyCylinder(this.scene, height, topRadius, bottomRadius, stacks_c, slices_c));
                            break;

                        case ("sphere"):
                            const radius = this.reader.getFloat(descendantsNodes[j], 'radius');
                            const slices_s = this.reader.getInteger(descendantsNodes[j], 'slices');
                            const stacks_s = this.reader.getInteger(descendantsNodes[j], 'stacks');

                            if (radius == null || slices_s == null || stacks_s == null)
                                return "Missing values for sphere leaf. Node id: " + nodeID;
                            else if (isNaN(radius) || isNaN(slices_s) || isNaN(stacks_s))
                                return "Invalid values for sphere leaf. Node id: " + nodeID;

                            leafs.push(new MySphere(this.scene, radius, slices_s, stacks_s));
                            break;

                        case ("torus"):
                            const inner = this.reader.getFloat(descendantsNodes[j],'inner');
                            const outer = this.reader.getFloat(descendantsNodes[j],'outer');
                            const loops = this.reader.getInteger(descendantsNodes[j],'loops');
                            const slices = this.reader.getInteger(descendantsNodes[j],'slices');

                            if (inner == null || outer == null || loops == null || slices == null)
                                return "Missing values for torus leaf. Node id: " + nodeID;
                            else if (isNaN(inner) || isNaN(outer) || isNaN(loops) || isNaN(slices))
                                return "Invalid values for torus leaf. Node id: " + nodeID;

                            leafs.push(new MyTorus(this.scene, inner, outer, slices, loops));
                            break;
                        default:
                            break;
                    }
                }
            }

            this.nodes[nodeID] = new MySceneGraphNode(this.scene, nodeID, childNodesID, leafs, transformationsMatrix, this.materials[materialID], this.textures[textureID], textureID);
        }

        for (const [nodeID, node] of Object.entries(this.nodes)) {
            for (const childID of node.childNodesID) {
                node.addChildNode(this.nodes[childID]);
            }
        }

        this.log("Parsed Nodes.");
        return null;
    }


    parseBoolean(node, name, messageError) {
        var boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false))) {
           this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");
           return true;
        }
        return boolVal;
   }
    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.nodes[this.idRoot].display(this.nodes[this.idRoot].material, this.nodes[this.idRoot].texture);
    }
}