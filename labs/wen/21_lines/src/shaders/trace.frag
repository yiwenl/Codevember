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
uniform float ry;
uniform float maxDist;
uniform vec3 bubblePos[NUM_ITER];
uniform float bubbleSize[NUM_ITER];


//	TOOLS
vec2 rotate(vec2 pos, float angle) {
	float c = cos(angle);
	float s = sin(angle);

	return mat2(c, s, -s, c) * pos;
}

float box( vec3 p, vec3 b ) {
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0));
}


float hash( vec2 p ) {
	float h = dot(p,vec2(127.1,311.7));	
    return fract(sin(h)*43758.5453123);
}

float noise( in vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );	
	vec2 u = f*f*(3.0-2.0*f);
    return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

float noise( float a, float b ) { 
	return noise(vec2(a, b));
}
//	GEOMETRY

vec3 rep(vec3 pos, float range) {
	return mod(pos+range, range*2.0)-range;
}

vec2 rep(vec2 pos, float range) {
	return mod(pos+range, range*2.0)-range;
}

float rep(float pos, float range) {
	return mod(pos, range)-range*.5;
}

// const float PI = 3.141592657;
float map(vec3 pos) {
	float zGap = .25;
	vec3 org = pos;
	float r = floor(org.x/.1) * .1;
	pos.x = rep(pos.x, .1);
	pos.z = rep(pos.z, zGap);

	float t;
	t = floor(org.z/zGap) * zGap;
	t = hash(vec2(t)) * .5 + .5;
	float h = noise(t, org.x*2.0) * .5 + .5;
	float size = t;
	size = smoothstep(.1, 1.0, size) * .1;

	pos.y += sin(org.x+ t * PI * 5.0) * h *.35;

	float d = box(pos, vec3(.1, size, size));

	return d;
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

const float lighty       = 2.01;

const vec3 lightPos0     = vec3(1.0, lighty,  1.0);
const vec3 lightColor0   = vec3(1.0, 1.0, .96);
const float lightWeight0 = 1.0;

const vec3 lightPos1     = vec3(-1.0, lighty,  .6);
const vec3 lightColor1   = vec3(.96, .96, 1.0);
const float lightWeight1 = 1.0;

vec3 envLight(vec3 normal, vec3 dir) {
	vec3 eye    = -dir;
	vec3 r      = reflect( eye, normal );
	float m     = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
	vec2 vN     = r.xy / m + .5;
	vN.y        = 1.0 - vN.y;
	vec3 color  = texture2D( texture, vN ).rgb;
    return color;
}

//	COLOR
vec4 getColor(vec3 pos, vec3 dir, vec3 normal) {
	vec4 color = vec4(lightColor0, 1.0);
	float roughness = 5.0;
	vec3 diff0 = orenNayarDiffuse(normalize(lightPos0), -dir, normal, roughness, lightWeight0) * lightColor0;
	vec3 diff1 = orenNayarDiffuse(normalize(lightPos1), -dir, normal, roughness, lightWeight1) * lightColor1;
	// vec3 env = envLight(normal, dir);
	float _ao = ao(pos, normal);

	// color.rgb = ((diff0 + diff1)+env) * _ao;
	color.rgb = (diff0 + diff1) * _ao;

	return color;
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr ) {
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

void main(void) {
	float timeOffset = 0.0;
	float radius     = 4.5;
	vec3 pos         = vec3(cos(ry) * radius, .50, sin(ry) * radius);

	vec3 ta          = vec3( 0.0, 0.0, 0.0 );
	mat3 ca          = setCamera( pos, ta, 0.0 );
	vec3 dir         = ca * normalize( vec3(uv,focus) );
	vec4 color       = vec4(0.0);
	float prec       = .0001;
	float d;
	bool hit         = false;
	
	for(int i=0; i<NUM_ITER; i++) {
		d = map(pos);						//	distance to object

		if(d < prec) {
			hit = true;
		}

		pos += d * dir;						//	move forward by
		if(length(pos) > maxDist) break;
	}

	if(hit) {
		color = vec4(1.0);
		vec3 normal = computeNormal(pos);
		color = getColor(pos, dir, normal);
	}
	

    gl_FragColor = color;
}