// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec4 vColor;

void main(void) {
	if(distance(gl_PointCoord, vec2(.5)) > .5) discard;

	float life = vColor.b;
	if( life <= 0.0) {	discard; }

	float a = smoothstep(.0, .1, life);
    gl_FragColor = vec4(vec3(1.0), a);
}