precision mediump float;

varying vec2 uv;

const float PI      = 3.141592657;
const int NUM_ITER  = {{NUM_ITER}};


uniform float time;
uniform float focus;
uniform float metaK;
uniform float maxDist;


//	TOOLS
vec2 rotate(vec2 pos, float angle) {
	float c = cos(angle);
	float s = sin(angle);

	return mat2(c, s, -s, c) * pos;
}

//	GEOMETRY
float sphere(vec3 pos, float radius) {	return length(pos) - radius;	}
float displacement(vec3 p) {	return sin(2.0*p.x+time*.983265)*sin(2.0*p.y+time*.57834)*sin(1.0*p.z+time*0.857834) * .5 + .5;	}
float box(vec3 pos, vec3 size) {	return length(max(abs(pos) - size, 0.0)); }

float substract(float d1, float d2) {	return max(-d1,d2);	}
float intersection(float d1, float d2) { return max(d1, d2);	}


const float thickness = .05;
const float gap = .15;
const float numLayers = 7.0;
const float diff = .3;

float shell(vec3 pos, float radius, float index) {
	pos.xz        = rotate(pos.xz, sin(index * diff-time*.35784));
	pos.yz        = rotate(pos.yz, cos(index * diff-time*.7845));
	// pos.yz        = rotate(pos.yz, -time * index * .01 + time * .5);
	float dOuter  = sphere(pos, radius);
	float dInner  = sphere(pos, radius-thickness);
	float dBox    = box(pos + vec3(0.0, 0.0, -radius), vec3(radius));
	
	float dSphere = substract(dInner, dOuter);
	float d       = intersection(dSphere, dBox);
	return d;
}


float map(vec3 pos) {
	float r = 1.5;
	float d = shell(pos, r, 0.0);
	float dShell;
	for(float i=1.0; i<numLayers; i+= 1.0) {
		r += gap;
		dShell = shell(pos, r, i);
		d = min(d, dShell);
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

float diffuse(vec3 normal, vec3 lightDirection) {
	return max(dot(normal, normalize(lightDirection)), 0.0);
}

vec3 diffuse(vec3 normal, vec3 lightDirection, vec3 lightColor) {
	return lightColor * diffuse(normal, lightDirection);
}

float specular(vec3 normal, vec3 dir) {
	vec3 h = normalize(normal - dir);
	return pow(max(dot(h, normal), 0.0), 50.0);
}


const vec3 lightPos0 = vec3(1.0, .75, -1.0);
const vec3 lightColor0 = vec3(1.0, 1.0, .96);
const float lightWeight0 = 0.75;

const vec3 lightPos1 = vec3(-1.0, -0.75, 0.0);
const vec3 lightColor1 = vec3(.96, .96, 1.0);
const float lightWeight1 = 0.25;


vec4 getColor(vec3 pos, vec3 dir, vec3 normal) {
	float ambient = .2;
	vec3 diff0 = diffuse(normal, lightPos0, lightColor0) * lightWeight0;
	vec3 diff1 = diffuse(normal, lightPos1, lightColor1) * lightWeight1;

	// float spec = specular(normal, dir) * 1.;
	vec3 color = vec3(ambient) + diff0 + diff1;

	return vec4(color, 1.0);
}

vec3 gradientMap(vec3 color) {
	const vec3 color0 = vec3(18.0, 19.0, 24.0)/255.0;
	const vec3 color1 = vec3(254.0, 248.0, 226.0)/255.0;
	float p = length(color)/length(vec3(1.0));
	return mix(color0, color1, p);
}

void main(void) {
	vec3 pos   = vec3(sin(time*.1)*0.0, 0.0, -10.0);		//	position of camera
	vec3 dir   = normalize(vec3(uv, focus));	//	ray
	vec4 color = vec4(.1, .1, .1, 1.0);
	float prec = pow(.1, 4.0);
	float d;
	
	for(int i=0; i<NUM_ITER; i++) {
		d = map(pos);						//	distance to object

		if(d < prec) {						// 	if get's really close, set as hit the object
			color       = vec4(1.0);
			vec3 normal = computeNormal(pos);
			color       = getColor(pos, dir, normal);
			break;
		}

		pos += d * dir;						//	move forward by
		if(length(pos) > maxDist) break;
	}
	
	// color.rgb = gradientMap(color.rgb);
    gl_FragColor = vec4(color);
}