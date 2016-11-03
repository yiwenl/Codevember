// raymarching.vert

precision mediump float;
attribute vec2 aPosition;
uniform float uAspectRatio;
varying vec2 uv;

void main(void) {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    vec2 coord = (aPosition * .5 + .5) * 2.0 - 1.0;
    coord.x *= uAspectRatio;

    uv = coord;
}