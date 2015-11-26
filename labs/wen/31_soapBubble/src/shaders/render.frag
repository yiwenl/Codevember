precision mediump float;

varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vVertex;
varying vec3 eye;
uniform float release;
uniform sampler2D textureLight;
uniform sampler2D textureSurface;


const float PI = 3.141592657;
const vec3 startingPoint = vec3(0.0, 1.0, 0.0);

float angleBetween(vec3 a, vec3 b) {
	float tmp = dot(a, b) / (length(a) + length(b));
	return acos(tmp);
}

vec3 env(sampler2D t) {
	vec3 r = reflect( eye, vNormal );
    float m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
    vec2 vN = r.xy / m + .5;

    return texture2D( t, vN ).rgb;
}

float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}

float cubicIn(float t) {
  return t * t * t;
}

void main(void) {

	vec3 envHDR = env(textureLight);
    envHDR.r = pow(envHDR.r , 2.0);
    envHDR = envHDR.rrr;
    vec3 envSurface = env(textureSurface);
    envHDR += envSurface * .5;
    vec3 n = vNormal * .5 + .5;
    float a = envHDR.r*2.0;
    envHDR = mix(envHDR, n, .25);

	float angle = angleBetween(startingPoint, vVertex);
	float theta = release * PI;
	float offset = angle < theta ? 1.0 : 0.0;

	// offset = 1.0;
    gl_FragColor = vec4(envHDR*offset, offset);
}