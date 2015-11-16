// balls.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 normalMatrix;
uniform vec3 position;
uniform float scale;
uniform vec3 axis;
uniform float angle;
uniform float frequency;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vRotateNormal;
varying vec3 vEye;


vec2 rotate(vec2 p, float a) {
	float c = cos(a);
	float s = sin(a);
	mat2 r = mat2(s, c, -c, s);
	return r * p;
}

vec4 quat_from_axis_angle(vec3 axis, float angle) { 
	vec4 qr;
	float half_angle = (angle * 0.5) * 3.14159 / 180.0;
	qr.x = axis.x * sin(half_angle);
	qr.y = axis.y * sin(half_angle);
	qr.z = axis.z * sin(half_angle);
	qr.w = cos(half_angle);
	return qr;
}


vec3 rotate_vertex_position(vec3 position, vec3 axis, float angle) { 
	vec4 q = quat_from_axis_angle(axis, angle);
	vec3 v = position.xyz;
	return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

void main(void) {
	vec3 pos = aVertexPosition*scale*(1.0+frequency*1.0) + position;
	vec4 mvPosition = uMVMatrix * vec4(pos, 1.0);
    gl_Position = uPMatrix * mvPosition;
    vTextureCoord = aTextureCoord;
    vNormal = normalMatrix * normalize(aVertexPosition);
    vEye = normalize(mvPosition.xyz);

    vRotateNormal = vNormal;
    vRotateNormal.xy = rotate(vNormal.xy, angle);
    vRotateNormal.yz = rotate(vNormal.yz, angle * .25);
}