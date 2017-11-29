// copy.frag

#extension GL_OES_standard_derivatives : enable

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vOldPos;
varying vec3 vNewPos;
uniform float uOpacity;

void main(void) {

	float d = distance(vTextureCoord, vec2(.5));
	d = smoothstep(.5, .3, d);

	float oldArea = length(dFdx(vOldPos)) * length(dFdy(vOldPos));
	float newArea = length(dFdx(vNewPos)) * length(dFdy(vNewPos));

	float g = oldArea / newArea * 0.2;
	gl_FragColor = vec4(vec3(g), 1.0) * d * uOpacity;
}