// sphere.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vVertex;
varying float vRadius;
uniform float zGap;
uniform float depthOffset;

const float PI = 3.141592657;

const vec3 lightPos = vec3(-1.0, 2.0, 1.5);

const vec4 color = vec4(186.0, 209.0, 222.0, 255.0)/255.0;


float cubicIn(float t) {
  return t * t * t;
}

float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}

float map(float value, float sx, float sy, float tx, float ty) {
	float p = (value - sx) / (sy - sx);
	return tx + p * (ty - tx);
}

void main(void) {
	float z = mod(vVertex.z+depthOffset, zGap)/zGap;
	// float grey = max(sin(z * PI * 2.0), 0.0);
	// float grey = max(cubicIn(sin(z * PI * 2.0)), 0.0);
	// float grey = exponentialIn(1.0-sin(z * PI));
	// float grey = cubicIn(1.0-sin(z * PI));
	float grey = cubicIn(1.0-sin(z * PI));

	vec3 N = vNormal;
	vec3 L = normalize(lightPos);
	float lambert = max(dot(N, L), .0);

	grey += cubicIn(lambert)*.6;

	float d = map(vVertex.z, -vRadius, vRadius, 0.0, 1.0);
	d = exponentialIn(d);
	grey *= mix(d, 1.0, .1);

    gl_FragColor = vec4(grey)*color;
}