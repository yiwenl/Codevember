precision mediump float;

varying vec2 uv;

const float PI      = 3.141592657;
const int NUM_BALLS = {{NUM_BALL}};
const int NUM_ITER  = {{NUM_ITER}};
// const float maxDist = 5.0;

uniform sampler2D texture;
uniform sampler2D textureBg;
uniform float time;
uniform float focus;
uniform float metaK;
uniform float zGap;
uniform float maxDist;


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

float map(vec3 pos) {
	float dIco = icosahedral(pos, 18.0+sin(time*.5) * 14.0, 1.0);
	return dIco;
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
const float fade = .92;
const vec3 lightPos0 = vec3(0.0, 20.0, 0.0);
const vec3 lightColor0 = vec3(1.0, 1.0, fade);
const float lightWeight0 = 0.25;

const vec3 lightPos1 = vec3(-20.0);
const vec3 lightColor1 = vec3(fade, fade, 1.0);
const float lightWeight1 = 0.25;


vec3 envLight(vec3 normal, vec3 dir, sampler2D t, float shininess) {
	vec3 eye    = -dir;
	vec3 r      = reflect( eye, normal );
	float m     = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
	vec2 vN     = r.xy / m + .5;
	vN.y        = 1.0 - vN.y;
	vec3 color  = texture2D( t, vN ).rgb;
	float power = 5.0 + sin(time*5.0) * 4.0;
	color.r     = pow(color.r, shininess);
	color       = color.rrr;
    return color;
}

vec3 envLight(vec3 normal, vec3 dir, sampler2D t) {
	return envLight(normal, dir, t, 1.0);
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 getColor(vec3 pos, vec3 dir, vec3 normal) {
	vec3 env      = envLight(normal, dir, texture, 3.0);
	vec3 envBg    = envLight(normal, dir, textureBg, 3.0);
	// vec3 envAdd   = envLight(normal, dir, texture, 10.0 + sin(time*3.0) * 5.0) * .5;
	vec3 envAdd   = envLight(normal, dir, texture, 10.0) * .5;
	vec3 envBgAdd = envLight(normal, dir, textureBg, 5.0) * .5;
	vec4 color    = vec4(1.0);
	color.rgb     = (envBg+envBgAdd) * .5 * lightColor1 + (env+envAdd) * .5 * lightColor0;
	return color;
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
	float radius = 5.0 + sin(time*.25) * 1.0;
	vec3 pos     = vec3( radius*cos(0.1*time), 0.0, radius*sin(0.1*time) );
	vec3 ta      = vec3( 0.0, 0.0, 0.0 );
	mat3 ca      = setCamera( pos, ta, 0.0 );
	vec3 dir     = ca * normalize( vec3(uv,focus) );

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