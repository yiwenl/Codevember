precision highp float;
varying vec4 vColor;
varying vec3 vWsNormal;


uniform vec3 uLightPos;

float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}

void main(void) {
	if(distance(gl_PointCoord, vec2(.5)) > .5) discard;

	vec4 color = vColor;
	// float d = diffuse(vWsNormal, uLightPos);
	// d = mix(d, 1.0, .25);
	// color.rgb *= d;

    gl_FragColor = color;
}