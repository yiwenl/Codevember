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

float plane(vec3 pos) {
	float displace = displacement(pos);
	return pos.y + displace * .1;
}

float map(vec3 pos, out int index) {
	float d = sphere(pos - bubblePos[0]/100.0, bubbleSize[0]/100.0);
	index = 0;

	for(int i=1; i<NUM_BALLS; i++) {
		vec3 p = bubblePos[i]/100.0;
		float s = bubbleSize[i]/100.0;
		float ds = sphere(pos - p, s);

		// d = min(d, ds);
		if(ds < d) {
			index = i;
			d = ds;
		}
	}

	return d;
}

float map(vec3 pos) {
	float d = sphere(pos - bubblePos[0]/100.0, bubbleSize[0]/100.0);

	for(int i=1; i<NUM_BALLS; i++) {
		vec3 p = bubblePos[i]/100.0;
		float s = bubbleSize[i]/100.0;
		float ds = sphere(pos - p, s);

		if(ds < d) {
			d = ds;
		}
	}

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
const vec3 lightPos0 = vec3(1.0, 1.0, -1.0);
const vec3 lightColor0 = vec3(1.0, 1.0, .96);
const float lightWeight0 = 0.25;

const vec3 lightPos1 = vec3(-1.0, -0.75, -.6);
const vec3 lightColor1 = vec3(.96, .96, 1.0);
const float lightWeight1 = 0.15;

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

vec4 getColor(vec3 pos, vec3 dir, vec3 normal, int index) {
	vec3 orgPos  = pos;
	float t      = float(index);
	float rnd    = rand(vec2(t));
	float fixRnd = mix(rnd, 1.0, .75);
	
	pos.xz       = rotate(pos.xz, rnd * 3.0);
	pos.yz       = rotate(pos.yz, rnd * 3.0);
	
	float base   = sin(pos.y*25.0*fixRnd-time*0.5)*.5 + .5;
	base         = smoothstep(.5, .6, base);
	
	float _ao    = ao(orgPos, normal);
	vec3 env     = envLight(normal, dir);
	return vec4(vec3(base+env)*_ao, 1.0);
	// return vec4(vec3(_ao*env)+grey, 1.0);
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
	vec3 pos = vec3( -0.5+3.5*cos(0.1*time + 6.0), 1.0 + 2.0, 0.5 + 3.5*sin(0.1*time + 6.0) );
	vec3 ta = vec3( 0.0, 0.0, 0.0 );
	
    mat3 ca = setCamera( pos, ta, 0.0 );
    
	vec3 dir = ca * normalize( vec3(uv,focus) );

	vec4 color = vec4(.0);
	float prec = pow(.1, 5.0);
	float d;
	bool hit = false;
	int index = -1;
	
	for(int i=0; i<NUM_ITER; i++) {
		d = map(pos, index);						//	distance to object

		if(d < prec) {						// 	if get's really close, set as hit the object
			hit = true;
		}

		pos += d * dir;						//	move forward by
		if(length(pos) > maxDist) break;
	}


	if(hit) {
		color = vec4(1.0);
		vec3 normal = computeNormal(pos);
		color = getColor(pos, dir, normal, index);
	}
	

    gl_FragColor = color;
}