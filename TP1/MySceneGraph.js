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
        var children = initialsNode.children;
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
        this.onXMLMinorError("To do: Parse views and create cameras.");
        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

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
        var children = lightsNode.children;

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

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        //For each texture in textures block, check ID and file URL
        this.onXMLMinorError("To do: Parse textures.");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

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
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            //Continue here
            this.onXMLMinorError("To do: Parse materials.");
        }

        //this.log("Parsed materials");
        return null;
    }

    /**
   * Parses the <nodes> block.
   * @param {nodes block element} nodesNode
   */
  parseNodes(nodesNode) {
        var children = nodesNode.children;

        this.nodes = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

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

            nodeNames = [];
            for (let j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");

            this.onXMLMinorError("To do: Parse nodes.");
            // Transformations
            let transformations = [];
            const transformationsNode = grandChildren[transformationsIndex].childNodes;
            for (let j = 0; j < transformationsNode.length; j++){
                if (transformationsNode[j].nodeName === "translation"){
                    const x = this.reader.getFloat(transformationsNode[j], "x");
                    const y = this.reader.getFloat(transformationsNode[j], "y");
                    const z = this.reader.getFloat(transformationsNode[j], "z");

                    if (x == null || y == null || z == null) {
                        return "Missing values for translation. Node id: " + nodeID;
                    }
                    if (isNaN(x) || isNaN(y) || isNaN(z)) {
                        return "Wrong values for translation. Node id: " + nodeID;
                    }

                    transformations.push({
                        type: "translation",
                        x: x,
                        y: y,
                        z: z
                    })
                }
                else if (transformationsNode[j].nodeName === "rotation") {
                    const axis = this.reader.getString(transformationsNode[j], 'axis');
                    const angle = this.reader.getFloat(transformationsNode[j], 'angle');

                    if (axis == null || (axis !== "xx" && axis !== "yy" && axis !== "zz")) {
                        return "Wrong value for axis on rotation. Node id: " + nodeID;
                    }
                    if (angle == null || isNaN(angle)) {
                        return "Wrong value for angle on rotation. Node id: " + nodeID;
                    }

                    transformations.push({
                        type: "rotation",
                        angle: angle * DEGREE_TO_RAD,
                        axis: axis
                    })
                }
                else if (transformationsNode[j].nodeName === "scale") {
                    const sx = this.reader.getFloat(transformationsNode[j], "sx")
                    const sy = this.reader.getFloat(transformationsNode[j], "sy")
                    const sz = this.reader.getFloat(transformationsNode[j], "sz")

                    if (sx == null || sy == null || sz == null) {
                        return "Missing values for scale. Node id: " + nodeID
                    }
                    if (isNaN(sx) || isNaN(sy) || isNaN(sz)) {
                        return "Wrong values for scale. Node id: " + nodeID
                    }

                    transformations.push({
                        type: "scale",
                        sx: sx,
                        sy: sy,
                        sz: sz
                    })
                }
            }

            const transformationsMatrix = mat4.create();
            for (let transf of transformations) {
                if (transf.type === "translation") {
                    mat4.translate(transformationsMatrix, transformationsMatrix, [transf.x, transf.y, transf.z]);
                }
                else if (transf.type === "rotation") {
                    mat4.rotate(transformationsMatrix, transformationsMatrix, transf.angle, this.axisCoords[transf.axis[0]]);
                }
                else if (transf.type === "scale") {
                    mat4.scale(transformationsMatrix, transformationsMatrix, [transf.sx, transf.sy, transf.sz]);
                }
            }


            // Material

            // Texture

            // Descendants
            const descendants = [];
            const descendantsNodes = grandChildren[descendantsIndex].childNodes;
            for (let j = 0; j < descendantsNodes.length; j++) {
                if (descendantsNodes[j].nodeName === "noderef") {
                    const descendantID = this.reader.getString(descendantsNodes[j],'id');

                    if (descendantID == null)
                        return "Undefined ID for descendant. Node id: " + nodeID;
                    else if (descendantID === nodeID)
                        return "Duplicated node id: " + nodeID;

                    descendants.push({
                        type: "noderef",
                        id: descendantID
                    })
                }
                else if (descendantsNodes[j].nodeName === "leaf") {
                    const type = this.reader.getString(descendantsNodes[j], "type", ['triangle', 'rectangle', 'cylinder', 'sphere', 'torus'])
                    if (type === "rectangle") {
                        const x1 = this.reader.getFloat(descendantsNodes[j], 'x1')
                        const y1 = this.reader.getFloat(descendantsNodes[j], 'y1')
                        const x2 = this.reader.getFloat(descendantsNodes[j], 'x2')
                        const y2 = this.reader.getFloat(descendantsNodes[j], 'y2')

                        if (x1 == null || x2 == null || y1 == null || y2 == null) {
                            return "Missing values for rectangle leaf. Node id: " + nodeID;
                        }
                        if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) {
                            return "Invalid values for rectangle leaf. Node id: " + nodeID;
                        }

                        descendants.push({
                            type: "rectangle",
                            x1: x1,
                            y1: y1,
                            x2: x2,
                            y2: y2
                        })
                    }
                    else if (type === "triangle") {
                        const x1 = this.reader.getFloat(descendantsNodes[j], 'x1')
                        const y1 = this.reader.getFloat(descendantsNodes[j], 'y1')
                        const x2 = this.reader.getFloat(descendantsNodes[j], 'x2')
                        const y2 = this.reader.getFloat(descendantsNodes[j], 'y2')
                        const x3 = this.reader.getFloat(descendantsNodes[j], 'x3')
                        const y3 = this.reader.getFloat(descendantsNodes[j], 'y3')

                        if (x1 == null || x2 == null || y1 == null || y2 == null || x3 == null || y3 == null ) {
                            return "Missing values for triangle leaf. Node id: " + nodeID;
                        }
                        if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2) || isNaN(x3) || isNaN(y3)) {
                            return "Invalid values for triangle leaf. Node id: " + nodeID;
                        }

                        descendants.push({
                            type: "triangle",
                            x1: x1,
                            y1: y1,
                            x2: x2,
                            y2: y2,
                            x3: x3,
                            y3: y3
                        })
                    }
                    else if (type === "cylinder") {
                        const height = this.reader.getFloat(descendantsNodes[j],'height')
                        const topRadius = this.reader.getFloat(descendantsNodes[j],'topRadius')
                        const bottomRadius = this.reader.getFloat(descendantsNodes[j],'bottomRadius')
                        const stacks = this.reader.getInteger(descendantsNodes[j],'stacks')
                        const slices = this.reader.getInteger(descendantsNodes[j],'slices')

                        if (height==null || topRadius==null || bottomRadius==null || stacks==null || slices==null) {
                            return "Missing values for cylinder leaf. Node id: " + nodeID;
                        }
                        else if (isNaN(height) || isNaN(topRadius) || isNaN(bottomRadius) || isNaN(stacks) || isNaN(slices)) {
                            return "Invalid values for cylinder leaf. Node id: " + nodeID;
                        }

                        descendants.push({
                            type: "cylinder",
                            height: height,
                            topRadius: topRadius,
                            bottomRadius: bottomRadius,
                            stacks: stacks,
                            slices: slices
                        })
                    }
                    else if (type === "sphere") {
                        const radius = this.reader.getFloat(descendantsNodes[j], 'radius')
                        const stacks = this.reader.getInteger(descendantsNodes[j], 'stacks')
                        const slices = this.reader.getInteger(descendantsNodes[j], 'slices')

                        if (radius == null || stacks == null || slices == null)
                            return "Missing values for sphere leaf. Node id: " + nodeID;
                        else if (isNaN(radius) || isNaN(stacks) || isNaN(slices))
                            return "Invalid values for sphere leaf. Node id: " + nodeID;

                        this.log("stacks: " + stacks)
                        this.log("slices: " + slices)

                        descendants.push({
                            type: "sphere",
                            radius: radius,
                            stacks: stacks,
                            slices: slices
                        })
                    }
                    else if (type === "torus") {
                        const inner = this.reader.getFloat(descendantsNodes[j],'inner')
                        const outer = this.reader.getFloat(descendantsNodes[j],'outer')
                        const loops = this.reader.getInteger(descendantsNodes[j],'loops')
                        const slices = this.reader.getInteger(descendantsNodes[j],'slices')

                        if (inner == null || outer == null || loops == null || slices == null)
                            return "Missing values for torus leaf. Node id: " + nodeID;
                        else if (isNaN(inner) || isNaN(outer) || isNaN(loops) || isNaN(slices))
                            return "Invalid values for torus leaf. Node id: " + nodeID;

                        descendants.push({
                            type: "torus",
                            inner: inner,
                            outer: outer,
                            loops: loops,
                            slices: slices
                        })
                    }
                }
            }
            if (descendants.length === 0) {
                return "No descendants! Node id: " + nodeID;
            }

            this.nodes[nodeID] = {
                matrix: transformationsMatrix,
                descendants: descendants
            }
        }

        return null;
    }


    parseBoolean(node, name, messageError){
        var boolVal = true;
        boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false)))
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");

        return boolVal || 1;
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

    processNode(node) {
        this.scene.multMatrix(node.matrix);

        for (let descendant of node.descendants) {
            if (descendant.type !== "noderef") {
                switch (descendant.type) {
                    case "rectangle":
                        new MyRectangle(this.scene, descendant.x1, descendant.y1, descendant.x2, descendant.y2).display()
                        break
                    case "triangle":
                        new MyTriangle(this.scene, descendant.x1, descendant.y1, descendant.x2, descendant.y2, descendant.x3, descendant.y3).display()
                        break
                    case "sphere":
                        new MySphere(this.scene, descendant.radius, descendant.slices, descendant.stacks).display()
                        break
                    case "cylinder":
                        new MyCylinder(this.scene, descendant.height, descendant.topRadius, descendant.bottomRadius, descendant.stacks, descendant.slices).display()
                        break
                    case "torus":
                        new MyTorus(this.scene, descendant.inner, descendant.outer, descendant.slices, descendant.loops).display()
                        break
                    default:
                        break
                }
            }
            else {
                this.scene.pushMatrix();
                this.processNode(this.nodes[descendant.id]);
                this.scene.popMatrix();
            }
        }
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.scene.pushMatrix();
        this.processNode(this.nodes[this.idRoot]);
        this.scene.popMatrix();
    }
}