precision mediump float;

varying vec2 uv;
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

const float PI      = 3.141592657;
const float thickness = .05;
const float gap = .15;
const float numLayers = 7.0;
const float diff = .3;
const float sphereRadius = 3.0;

float map(vec3 pos) {
	pos.yz = rotate(pos.yz, -PI*.15+sin(time*.5)*.05);
	pos.xz = rotate(pos.xz, -PI*.15+cos(time*.5)*.05);
	float d = sphere(pos, sphereRadius);

	float r = length(pos.xy);
	float a = atan(pos.y, pos.x);
	float dOffset = cos( (a+r*6.0)*1.0-time*.5) * .5 + .5;
	dOffset *= 1.0-r/sphereRadius;
	d += dOffset * .2;
	
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

const vec3 lightPos0 = vec3(1.0, 1.0, -1.0);
const vec3 lightColor0 = vec3(1.0, 1.0, .96);
const float lightWeight0 = 1.25;

const vec3 lightPos1 = vec3(-1.0, -0.75, -.6);
const vec3 lightColor1 = vec3(.96, .96, 1.0);
const float lightWeight1 = 0.5;

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


vec4 getColor(vec3 pos, vec3 dir, vec3 normal) {
	vec3 diff0 = orenNayarDiffuse(normalize(lightPos0), -dir, normal, 1.1, lightWeight0) * lightColor0;
	vec3 diff1 = orenNayarDiffuse(normalize(lightPos1), -dir, normal, 1.1, lightWeight1) * lightColor1;
	float spec = gaussianSpecular(normalize(lightPos0), -dir, normal, .1) * 1.0;
	float _ao = ao(pos, normal);

	vec3 color = vec3(diff0 + diff1 + spec) * mix(_ao, 1.0, 1.0);
	return vec4(color, 1.0);
}

void main(void) {
	vec3 pos   = vec3(sin(time*.1)*0.0, 0.0, -10.0);		//	position of camera
	vec3 dir   = normalize(vec3(uv, focus));	//	ray
	vec4 color = vec4(0.0);
	float bg = dot(dir, vec3(0.0, 0.0, -1.0));
	float prec = 0.0001;
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