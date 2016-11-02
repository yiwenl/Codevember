// terrain.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying float vHeight;

void main(void) {
    gl_FragColor = vec4(vec3(vHeight), 1.0);
}