attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix; // Model.View matrix
uniform mat4 uPMatrix;  // Projection matrix
uniform mat4 uNMatrix;    // Normal transformation matrix

varying vec2 vTextureCoord;

uniform float resizeM;
uniform float resizeN;
uniform float shiftM;
uniform float shiftN;


void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    vTextureCoord = (aTextureCoord * vec2(resizeM,resizeN)) + vec2(shiftM, shiftN);
}