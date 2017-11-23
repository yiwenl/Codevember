// save.frag

#extension GL_EXT_draw_buffers : require 
precision highp float;

varying vec3 vColor;
varying vec3 vExtra;
varying vec3 vExtra2;

void main(void) {
    gl_FragData[0] = vec4(vColor, 1.0);
    gl_FragData[1] = vec4(vExtra.x, (vExtra.yz * 2.0 - 1.0) * 0.1, 1.0);
    gl_FragData[2] = vec4(vExtra, 1.0);
    gl_FragData[3] = vec4(vExtra2, 1.0);
}