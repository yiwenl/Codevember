// copy.frag

precision highp float;
varying vec3 vNormal;
varying vec4 vWsPosition;

void main(void) {
    gl_FragColor = vec4(vWsPosition.xyz, 1.0);
}