class MySpriteText {
    constructor(scene, text) {
        this.scene = scene;
        this.text = text;

        this.spritesheet = new MySpritesheet(this.scene, new CGFtexture(this.scene, "./spritesheets/images/text.png"), 16, 16);
        this.rectangle = new MyRectangle(this.scene, 0,0,1,1);

        this.map = {
            ' ':32, '!':33,'"':34, "#":35, '$':36, '%':37, '&':38, '\'':39, '(':40, ')':41, '*':42, '+':43, ',':44, '-':45, '.':46, '/':47,
            '0':48, '1':49, '2':50, '3':51, '4':52, '5':53, '6':54, '7':55, '8':56, '9':57, ':':58, ';':59, '<':60, '=':61, '>':62, '?':63,
            '@':64, 'A':65, 'B':66, 'C':67, 'D':68, 'E':69, 'F':70, 'G':71, 'H':72, 'I':73, 'J':74, 'K':75, 'L':76, 'M':77, 'N':78, 'O':79,
            'P':80, 'Q':81, 'R':82, 'S':83, 'T':84, 'U':85, 'V':86, 'W':87, 'X':88, 'Y':89, 'Z':90, '[':91,'\\':92, ']':93, '^':94, '_':95,
            '`':96, 'a':97, 'b':98, 'c':99, 'd':100, 'e':101, 'f':102, 'g':103, 'h':104, 'i':105, 'j':106, 'k':107, 'l':108, 'm':109, 'n':110, 'o':111,
            'p':112, 'q':113, 'r':114, 's':115, 't':116, 'u':117, 'v':118, 'w':119, 'x':120, 'y':121, 'z':122, '{':123, '|':124, '}':125, '~':126,
            
            'À':192, 'Á':193, 'Â':194, 'Ã':195, 'Ä':196, 'Å':197, 'Æ':198, 'Ç':199, 'È':200, 'É':201, 'Ê':202, 'Ë':203, 'Ì':204, 'Í':205, 'Î':206, 'Ï':207,
            'Ð':208, 'Ñ':209, 'Ò':210, 'Ó':211, 'Ô':212, 'Õ':213, 'Ö':214, '×':215, 'Ø':216, 'Ù':217, 'Ú':218, 'Û':219, 'Ü':220, 'Ý':221, 'Þ':222, 'ß':223,
            'à':224, 'á':225, 'â':226, 'ã':227, 'ä':228, 'å':229, 'æ':230, 'ç':231, 'è':232, 'é':233, 'ê':234, 'ë':235, 'ì':236, 'í':237, 'î':238, 'ï':239,
            'ð':240, 'ñ':241, 'ò':242, 'ó':243, 'ô':244, 'õ':245, 'ö':246, '÷':247, 'ø':248, 'ù':249, 'ú':250, 'û':251, 'ü':252, 'ý':253, 'þ':254, 'ÿ':255
        };

        this.centerX = -this.text.length/2;
    }

    getCharacterPosition(character){
        let pos = this.map[character];
        if(pos == null){
            pos = 0;
        }
        return pos;
    }

    display(){
        this.spritesheet.setUniValues();
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);

        this.scene.pushMatrix();
        this.scene.translate(this.centerX, -0.5, 0);
        for(let c of this.text){
            this.spritesheet.activateCellP(this.getCharacterPosition(c));
            this.rectangle.display();
            this.scene.translate(1,0,0);
        }
        this.scene.popMatrix();

        this.scene.gl.disable(this.scene.gl.BLEND);
        this.scene.setActiveShaderSimple(this.scene.defaultShader);
    }
}