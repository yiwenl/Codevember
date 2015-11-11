precision mediump float;

varying vec2 uv;

const float PI      = 3.141592657;
const int NUM_BALLS = {{NUM_BALL}};
const int NUM_ITER  = {{NUM_ITER}};
// const float maxDist = 5.0;

uniform sampler2D texture;
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

float box( vec3 p, vec3 b ) {
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0));
}

float box( vec3 p, float b ) {
	return box(p, vec3(b));
}

//	GEOMETRY
float sphere(vec3 pos, float radius) {
	return length(pos) - radius;
}

float displacement(vec3 pos) {
	return sin(2.0*pos.x)*sin(2.0*pos.z) * .5 + .5;
}

float plane( vec3 p, vec4 n ) {
  // n must be normalized
  return dot(p,n.xyz) + n.w;
}

vec3 n1 = vec3(1.000,0.000,0.000);
vec3 n2 = vec3(0.000,1.000,0.000);
vec3 n3 = vec3(0.000,0.000,1.000);
vec3 n4 = vec3(0.577,0.577,0.577);
vec3 n5 = vec3(-0.577,0.577,0.577);
vec3 n6 = vec3(0.577,-0.577,0.577);
vec3 n7 = vec3(0.577,0.577,-0.577);
vec3 n8 = vec3(0.000,0.357,0.934);
vec3 n9 = vec3(0.000,-0.357,0.934);
vec3 n10 = vec3(0.934,0.000,0.357);
vec3 n11 = vec3(-0.934,0.000,0.357);
vec3 n12 = vec3(0.357,0.934,0.000);
vec3 n13 = vec3(-0.357,0.934,0.000);
vec3 n14 = vec3(0.000,0.851,0.526);
vec3 n15 = vec3(0.000,-0.851,0.526);
vec3 n16 = vec3(0.526,0.000,0.851);
vec3 n17 = vec3(-0.526,0.000,0.851);
vec3 n18 = vec3(0.851,0.526,0.000);
vec3 n19 = vec3(-0.851,0.526,0.000);

float icosahedral(vec3 p, float e, float r) {
	float s = pow(abs(dot(p,n4)),e);
	s += pow(abs(dot(p,n5)),e);
	s += pow(abs(dot(p,n6)),e);
	s += pow(abs(dot(p,n7)),e);
	s += pow(abs(dot(p,n8)),e);
	s += pow(abs(dot(p,n9)),e);
	s += pow(abs(dot(p,n10)),e);
	s += pow(abs(dot(p,n11)),e);
	s += pow(abs(dot(p,n12)),e);
	s += pow(abs(dot(p,n13)),e);
	s = pow(s, 1./e);
	return s-r;
}

const float gridSize = .5;

float map(vec3 pos) {
	vec4 _plane = vec4(0.0, 1.0, 0.0, 1.0);
	_plane.xyz = normalize(_plane.xyz);
	float d = plane(pos, _plane);
	float dBox = box(pos, 1.0);

	float dIco = icosahedral(pos, 36.0, 2.0);

	return dIco;
	return min(d, dBox);
}

vec3 computeNormal(vec3 pos) {
	vec2 eps = vec2(0.001, 0.0);

	vec3 normal = vec3(
		map(pos + eps.xyy) - map(pos - eps.xyy),
		map(pos + eps.yxy) - map(pos - eps.yxy),
		map(pos + eps.yyx) - map(pos - eps.yyx)
	);
	return normalize(normal);
}


//	LIGHTING
const vec3 lightPos0 = vec3(0.0, 20.0, 0.0);
const vec3 lightColor0 = vec3(1.0, 1.0, .96);
const float lightWeight0 = 0.25;

const vec3 lightPos1 = vec3(-20.0);
const vec3 lightColor1 = vec3(.96, .96, 1.0);
const float lightWeight1 = 0.25;

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

float ao( in vec3 pos, in vec3 nor ){
	float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<5; i++ )
    {
        float hr = 0.01 + 0.12*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos );
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );    
}

vec3 envLight(vec3 normal, vec3 dir) {
	vec3 eye    = -dir;
	vec3 r      = reflect( eye, normal );
	float m     = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
	vec2 vN     = r.xy / m + .5;
	vN.y        = 1.0 - vN.y;
	vec3 color  = texture2D( texture, vN ).rgb;
	float power = 10.0;
	color.r     = pow(color.r, power);
	color       = color.rrr;
    return color;
}



float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 getColor(vec3 pos, vec3 dir, vec3 normal) {
	float _ao    = ao(pos, normal);
	vec3 L0 	 = normalize(lightPos0);
	vec3 L1 	 = normalize(lightPos1);
	vec3 diff0   = orenNayarDiffuse(L0, -dir, normal, 1.0, lightWeight0) * lightColor0;
	vec3 diff1   = orenNayarDiffuse(L1, -dir, normal, 1.0, lightWeight1) * lightColor1;
	vec3 spec0   = gaussianSpecular(L0, -dir, normal, .5) * lightColor0;
	vec3 env     = envLight(normal, dir);
	// return vec4(vec3(diff0 + diff1 + spec0 + env)*_ao, 1.0);
	return vec4(vec3(env+diff0+diff1)*_ao, 1.0);
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr )
{
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

void main(void) {
	// vec3 pos = vec3( -0.5+3.5*cos(0.1*time + 6.0), 1.0 + 2.0, 0.5 + 1.5*sin(0.1*time + 6.0) );
	vec3 pos = vec3( 3.5*cos(0.1*time), 10.0, 3.5*sin(0.1*time) );
	vec3 ta = vec3( 0.0, 0.0, 0.0 );
	
    mat3 ca = setCamera( pos, ta, 0.0 );
    
	vec3 dir = ca * normalize( vec3(uv,focus) );

	vec4 color = vec4(.0);
	float prec = pow(.1, 5.0);
	float d;
	bool hit = false;
	
	for(int i=0; i<NUM_ITER; i++) {
		d = map(pos);						//	distance to object

		if(d < prec) {						// 	if get's really close, set as hit the object
			hit = true;
		}

		pos += d * dir;						//	move forward by
		// if(length(pos) > maxDist) break;
	}


	if(hit) {
		color = vec4(1.0);
		vec3 normal = computeNormal(pos);
		color = getColor(pos, dir, normal);
	}
	

    gl_FragColor = color;
}