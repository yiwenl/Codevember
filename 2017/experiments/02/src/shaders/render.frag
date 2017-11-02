precision highp float;
varying vec4 vColor;
varying vec2 vUV;
varying vec3 vPosition;

uniform sampler2D textureNormal;

float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}

const vec3 LIGHT = vec3(1.0, .8, .6);

void main(void) {
	if(vColor.a <= 0.0) discard;
	if(distance(gl_PointCoord, vec2(.5)) > .5) discard;

	vec3 N = texture2D(textureNormal, vUV).rgb * 2.0 - 1.0;
	float d = diffuse(N, LIGHT);
	d = mix(d, 1.0, .5);

	float t = abs(vPosition.x);
	t = smoothstep(5.0, 4.0, t);

	vec3 color = mix(vColor.rgb, vec3(1.0), .5);

	gl_FragColor = vec4(color * d, t);
}