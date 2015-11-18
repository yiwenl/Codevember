// jelly.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
// varying vec2 vTextureCoord;
// uniform sampler2D texture;

varying vec3 vNormal;
varying vec3 vVertex;

void main(void) {
    gl_FragColor = vec4(vNormal * .5 + .5, 1.0);
}