// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;
attribute vec3 aScale;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform float uTime;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying float vLife;

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}


#define PI 3.141592653

void main(void) {
	vec3 position = aVertexPosition;
	position.xy *= aScale.xy;
	position.xz = rotate(position.xz, aScale.z);
	

	vec3 dir = vec3(aExtra.x - .5, 1.0, aExtra.z - .5);
	dir = normalize(dir);
	float t = mod(aExtra.x + uTime * mix(aExtra.y, 1.0, .5) * 0.1, 1.0);
	vLife = t;
	float r = smoothstep(.75, 1.0, t);
	t = smoothstep(.25, 1.0, t);
	t = exponentialIn(t);

	vec3 axis = normalize(aExtra);
	float a = aExtra.y + mod(uTime * mix(aExtra.z, 1.0, .5), PI * 2.0) * 2.0;
	a *= r;

	position = rotate(position, axis, a);

	position += aPosOffset;
	position += t * mix(aExtra.z, 1.0, .5) * dir * 5.0;
	
	
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;

}