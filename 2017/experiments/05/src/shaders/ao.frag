// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vPosition;



void main(void) {
	const vec3 FRONT = vec3(0.0, 0.0, 1.0);
	float d = dot(vPosition, FRONT);
	d = smoothstep(0.25, 0.75, d) * 0.65;

    gl_FragColor = vec4(vec3(d), 1.0);
    // gl_FragColor = vec4(vec3(0.0), d);
}