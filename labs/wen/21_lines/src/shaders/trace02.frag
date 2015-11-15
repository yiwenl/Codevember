precision mediump float;

varying vec2 uv;
uniform float time;


vec2 rotate(vec2 pos, float angle) {
	float c = cos(angle);
	float s = sin(angle);

	return mat2(c, s, -s, c) * pos;
}

float plane(vec3 pos) {
	return pos.y;
}

float sphere(vec3 pos, float radius) {
	return length(pos) - radius;
}

float box(vec3 pos, vec3 size) {
    return length(max(abs(pos) - size, 0.0));
}

float roundedBox(vec3 pos, vec3 size, float radius) {
	return length(max(abs(pos) - size, 0.0)) - radius;
}

float map(vec3 pos) {
	float plantDist = plane(pos);
	pos.xy = rotate(pos.xy, pos.z * .008 * sin(time*.1));

	pos = mod(pos+10.0, 20.0) - 10.0;

	pos.xy = rotate(pos.xy, time*.587);	
	pos.yz = rotate(pos.yz, time*.078);	

	return min(plantDist, roundedBox(pos, vec3(2.0), 1.0));
}

vec3 computeNormal(vec3 pos) {
	vec2 eps = vec2(0.01, 0.0);

	vec3 normal = vec3(
		map(pos + eps.xyy) - map(pos - eps.xyy),
		map(pos + eps.yxy) - map(pos - eps.yxy),
		map(pos + eps.yyx) - map(pos - eps.yyx)
	);
	return normalize(normal);
}

vec3 albedo(vec3 pos) {
	vec3 color = vec3(.0);

	pos *= .5;
	float f = smoothstep(.275, .3, fract(pos.x - sin(pos.z) * .54));
	color = vec3(f);

	return color;
}

const vec3 lightDirection = vec3(1.0);

float diffuse(vec3 normal) {
	vec3 L = normalize(lightDirection);
	// return max(dot(normal, L), 0.0);
	return dot(normal, L) * .5 + .5;
}


float specular(vec3 normal, vec3 dir) {
	vec3 h = normalize(normal - dir);
	return pow(max(dot(h, normal), 0.0), 140.0);
}

const int NUM_ITER = 64;
const float focus = 1.0;
const vec3 sky = vec3(1.0, 1.0, .96);
const vec3 yellow = vec3(1.0, 1.0, .9);
const vec3 blue = vec3(.95, .96, 1.0);

void main(void) {

	vec3 pos = vec3(sin(time * .2), 5.0+cos(time*.23), -10.0);
	vec3 dir = normalize(vec3(uv, focus));

	vec3 color = vec3(.0);

	
	for(int i=0; i<NUM_ITER; i++) {
		float d = map(pos);
		if(d < 0.01) {
			float lightDistance = sphere(pos, 1.0);
			vec3 normal = computeNormal(pos);
			float diff = diffuse(normal);
			float spec = specular(normal, dir);
			// color = (diff + spec) * 10.0 / (lightDistance * lightDistance) * blue * albedo(pos);
			color = (diff + spec) * yellow * albedo(pos);
			break;
		}

		pos += d * dir;

	}
	// vec3 N = computeNormal(pos);


	float fog = exp(-pos.z * 0.03);
	color = mix(sky, color, fog);

	
    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(vec3(diffuse(N)), 1.0);
    // gl_FragColor = vec4(vec3(specular(N, dir)), 1.0);
    // gl_FragColor = vec4(vec3(specular(N, dir))+vec3(diffuse(N)), 1.0);

}