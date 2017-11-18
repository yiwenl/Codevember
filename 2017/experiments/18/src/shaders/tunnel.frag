// copy.frag

#extension GL_EXT_draw_buffers : require 

precision highp float;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vTextureCoord;
uniform sampler2D texture;

void main(void) {
    vec4 color;
    if(gl_FrontFacing) {
		color = vec4(0.0, 0.0, 1.0, 1.0);
	} else {
		color = vec4(1.0, 0.0, 0.0, 1.0);
	}

	gl_FragData[0] = color;
	gl_FragData[1] = vec4(vPosition, 1.0);
	gl_FragData[2] = vec4(vTextureCoord, color.b, 1.0);
	gl_FragData[3] = vec4(vNormal, 1.0);
}