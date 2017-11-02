// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE
#extension GL_EXT_draw_buffers : require 

precision highp float;
varying vec2 vTextureCoord;
uniform float uSeed;

#define NUM_OCTAVES 4

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

float fbm(vec2 x) {
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100);
	// Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
	for (int i = 0; i < NUM_OCTAVES; ++i) {
		v += a * noise(x);
		x = rot * x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}


void main(void) {
	const vec2 size = vec2(2.0,0.0) * 0.05;
	const float s = 0.01;
	vec3 offset = vec3(s, 0.0, -s);
	float scale = 3.;
	float s11 = fbm(vTextureCoord * scale + uSeed);
	float s01 = fbm((vTextureCoord + offset.zy) * scale + uSeed);
	float s21 = fbm((vTextureCoord + offset.xy) * scale + uSeed);
	float s12 = fbm((vTextureCoord + offset.yx) * scale + uSeed);
	float s10 = fbm((vTextureCoord + offset.yz) * scale + uSeed);

	vec3 va = normalize(vec3(size.xy,s21-s01));
    vec3 vb = normalize(vec3(size.yx,s12-s10));
    vec3 n = cross(va,vb);


    // gl_FragColor = vec4(vec3(s11), 1.0);

    gl_FragData[0] = vec4(vec3(s11), 1.0);
    gl_FragData[1] = vec4(n, 1.0);
    gl_FragData[2] = vec4(1.0);
    gl_FragData[3] = vec4(1.0);
}