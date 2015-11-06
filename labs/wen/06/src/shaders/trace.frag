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

float plane(vec3 pos) {
	return pos.y;
}


//	INTERSECT / MAP / NORMAL

float displacement(vec3 p) {
	return sin(2.0*p.x+time)*sin(2.0*p.y+time*.57834)*sin(1.0*p.z+time*0.857834);
}

float map(vec3 pos) {
	pos.xz = rotate(pos.xz, time+pos.y);

	float d1 = sphere(pos, 2.0);
	float d2 = displacement(pos)*.1;
	float d3 = sphere(pos+vec3(.15, 0.0, 0.0), 2.0);

	return max(d3, -(d1+d2));
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

const vec3 lightColorYellow = vec3(1.0, 1.0, .95);
const vec3 lightColorBlue = vec3(.95, .95, 1.0);
const vec3 lightDirection = vec3(1.0, .75, -1.0);
const vec4 lightBlue = vec4(186.0, 209.0, 222.0, 255.0)/255.0;
// const vec3 lightDirection = vec3(1.0, 1.0, 0.0);


float diffuse(vec3 normal) {
	return max(dot(normal, normalize(lightDirection)), 0.0);
}

float specular(vec3 normal, vec3 dir) {
	vec3 h = normalize(normal - dir);
	return pow(max(dot(h, normal), 0.0), 40.0);
}

//	COLOR

float cubicIn(float t) {
  return t * t * t;
}

vec3 cubicIn(vec3 value){
	return vec3(cubicIn(value.r), cubicIn(value.g), cubicIn(value.b));
}

vec4 getColor(vec3 pos, vec3 dir, vec3 normal) {
	float ambient = .2;
	float diff = diffuse(normal) * .75;
	float spec = specular(normal, dir) * .5;
	vec3 color = vec3(ambient + diff + spec * .5);
	// vec3 color = normalize(normal.rgg) + diff + spec;

	return vec4(color, 1.0);
}

void main(void) {
	vec3 pos = vec3(0.0, 0.0, -10.0);		//	position of camera
	// vec3 orgPos = vec3(0.0, 1.5, -10.0);
	vec3 dir = normalize(vec3(uv, focus));	//	ray
	
	vec4 color = vec4(1.0, 1.0, .986, 1.0);
	float prec = pow(.1, 5.0);
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
		// if(length(pos) > maxDist) break;
	}
	

    gl_FragColor = vec4(color);
}