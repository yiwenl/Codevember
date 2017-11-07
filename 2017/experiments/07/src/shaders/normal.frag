// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vWsNormal;

void main(void) {
    gl_FragColor = vec4(vWsNormal * .5 + .5, 1.0);
}