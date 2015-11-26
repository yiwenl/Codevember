// bubble.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vVertex;
varying vec3 eye;
uniform sampler2D texture;
uniform sampler2D textureSurface;
uniform float release;
uniform float opacity;

vec3 env(sampler2D t) {
	vec3 r = reflect( eye, vNormal );
    float m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
    vec2 vN = r.xy / m + .5;

    return texture2D( t, vN ).rgb;
}


float contrast(float value, float scale) {
    return .5 + (value - .5) * scale;
}


vec3 contrast(vec3 value, float scale) {
    return vec3(contrast(value.x, scale),contrast(value.y, scale),contrast(value.z, scale));
}

const float PI = 3.141592657;
const vec3 startingPoint = vec3(0.0, 1.0, 0.0);

float angleBetween(vec3 a, vec3 b) {
    float tmp = dot(a, b) / (length(a) + length(b));
    return acos(tmp);
}

float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}

float cubicIn(float t) {
  return t * t * t;
}

void main(void) {
    vec3 envHDR     = env(texture);
    envHDR.r        = pow(envHDR.r , 2.0);
    envHDR          = envHDR.rrr;
    vec3 envSurface = env(textureSurface);
    // envHDR          += envSurface * .25;
    vec3 n          = vNormal * .5 + .5;
    float a         = .75;
    // envHDR          = mix(envHDR, n, .75);
    envHDR          += envSurface * n * .5;

    float angle = angleBetween(startingPoint, vVertex);
    float theta = release * PI;
    float offset = angle < theta ? 1.0 : 0.0;

    a *= (1.0-offset);
    if(a < .001) discard;

    gl_FragColor = vec4(envHDR, a*opacity);
}