precision mediump float;

varying vec2 uv;

const float PI      = 3.141592657;
const int NUM_BALLS = {{NUM_BALL}};
const int NUM_ITER  = {{NUM_ITER}};
// const float maxDist = 5.0;


uniform float time;
uniform float focus;
uniform float metaK;
uniform float zGap;
uniform float maxDist;
uniform vec3 bubblePos[NUM_ITER];
uniform float bubbleSize[NUM_ITER];


//	TOOLS
vec2 rotate(vec2 pos, float angle) {
	float c = cos(angle);
	float s = sin(angle);

	return mat2(c, s, -s, c) * pos;
}

float smin( float a, float b, float k )
{
    float res = exp( -k*a ) + exp( -k*b );
    return -log( res )/k;
}

float smin( float a, float b )
{
    return smin(a, b, 7.0);
}

//	GEOMETRY
float sphere(vec3 pos, float radius) {
	return length(pos) - radius;
}

float box(vec3 pos, vec3 size) {
    return length(max(abs(pos) - size, 0.0));
}

float box(vec3 pos, float size) {
    return box(pos, vec3(size));
}

//	INTERSECT / MAP / NORMAL

float map(vec3 pos) {
	pos.xz = rotate(pos.xz, PI * .15);
	// pos.yz = rotate(pos.yz, PI * .35);
	float d = box(pos - bubblePos[0], bubbleSize[0]);

	for(int i=1; i<NUM_BALLS; i++) {
		vec3 bPos = bubblePos[i];
		float bSize = bubbleSize[i];
		float ds = box(pos - bubblePos[i], bubbleSize[i]);
		d = smin(d, ds);
	}

	return d;
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


//	LIGHTING
float gaussianSpecular(vec3 lightDirection, vec3 viewDirection, vec3 surfaceNormal, float shininess) {
	vec3 H = normalize(lightDirection + viewDirection);
	float theta = acos(dot(H, surfaceNormal));
	float w = theta / shininess;
	return exp(-w*w);
}

float orenNayarDiffuse(vec3 lightDirection,	vec3 viewDirection,	vec3 surfaceNormal,	float roughness, float albedo) {
	float LdotV = dot(lightDirection, viewDirection);
	float NdotL = dot(lightDirection, surfaceNormal);
	float NdotV = dot(surfaceNormal, viewDirection);

	float s = LdotV - NdotL * NdotV;
	float t = mix(1.0, max(NdotL, NdotV), step(0.0, s));

	float sigma2 = roughness * roughness;
	float A = 1.0 + sigma2 * (albedo / (sigma2 + 0.13) + 0.5 / (sigma2 + 0.33));
	float B = 0.45 * sigma2 / (sigma2 + 0.09);

	return albedo * max(0.0, NdotL) * (A + B * s / t) / 3.14159265;
}

//	COLOR


const vec3 lightPos0 = vec3(1.0, 1.0, -1.0);
const vec3 lightColor0 = vec3(1.0, 1.0, .96);
const float lightWeight0 = 0.35;

const vec3 lightPos1 = vec3(-1.0, -0.75, -.6);
const vec3 lightColor1 = vec3(.96, .96, 1.0);
const float lightWeight1 = 0.1;

vec4 getColor(vec3 pos, vec3 dir, vec3 normal) {
	float base = sin(pos.y * 10.0) * .5 + .5;
	base = pow(base, 50.0);

	vec3 diff0 = orenNayarDiffuse(normalize(lightPos0), -dir, normal, 1.1, lightWeight0) * lightColor0;
	vec3 diff1 = orenNayarDiffuse(normalize(lightPos1), -dir, normal, 1.1, lightWeight1) * lightColor1;
	float spec = gaussianSpecular(normalize(lightPos0), -dir, normal, .25) * 1.5;

	// vec3 color = vec3(diff0 + diff1 + spec) * base;
	vec3 color = vec3(base + (diff0 + diff1) + spec);

	return vec4(color, 1.0);
}

void main(void) {
	vec3 pos = vec3(0.0, 0.0, -10.0);		//	position of camera
	// vec3 orgPos = vec3(0.0, 1.5, -10.0);
	vec3 dir = normalize(vec3(uv, focus));	//	ray
	
	vec4 color = vec4(.0);
	float prec = .00001;
	float d;
	
	for(int i=0; i<NUM_ITER; i++) {
		d = map(pos);						//	distance to object

		if(d < prec) {						// 	if get's really close, set as hit the object
			color = vec4(1.0);
			vec3 normal = computeNormal(pos);
			color = getColor(pos, dir, normal);
			break;
		}

		pos += d * dir;						//	move forward by
		if(length(pos) > maxDist) break;
	}
	

    gl_FragColor = color;
}