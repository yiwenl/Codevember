precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec3 aCenter;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform vec4 axisAngle;
uniform vec3 meshPos;

uniform float time;

varying vec3 vColor;

varying vec3 vViewPosition;

const float PI = 3.141592657;

float exponentialInOut(float t) {
  return t == 0.0 || t == 1.0
    ? t
    : t < 0.5
      ? +0.5 * pow(2.0, (20.0 * t) - 10.0)
      : -0.5 * pow(2.0, 10.0 - (t * 20.0)) + 1.0;
}

vec4 quat_from_axis_angle(vec3 axis, float angle)
{ 
  vec4 qr;
  float half_angle = (angle * 0.5) * 3.14159 / 180.0;
  qr.x = axis.x * sin(half_angle);
  qr.y = axis.y * sin(half_angle);
  qr.z = axis.z * sin(half_angle);
  qr.w = cos(half_angle);
  return qr;
}

vec3 rotate_vertex_position(vec3 position, vec3 axis, float angle)
{ 
  vec4 q = quat_from_axis_angle(axis, angle);
  vec3 v = position.xyz;
  return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

void main(void) {

	// float lengthCenter = length(aCenter);
    // float scale = (sin(aCenter.x * .01 + time) * cos(aCenter.y * .02 + time) * sin(aCenter.z * .015 + time)) * .5 + .5;

    // vec3 nPos = normalize(aVertexPosition);
    // vec3 nCenter = normalize(aCenter);
    // float nOffset = sin(nCenter.x * .5 * PI + time);
    // nOffset = smoothstep(0.0, 1.0, nOffset);

    // float scale = 1.0 + nOffset * .25;
    // float r = lengthCenter * scale;
    // vec3 newCenter = normalize(aCenter) * r;
    // vec3 posOffset = newCenter - aCenter;

    vec3 relativePos = aVertexPosition - aCenter;
    // float angleOffset = smoothstep(0.0, 1.5, nOffset);
    // float angle = exponentialInOut(angleOffset)*36.0;
    // relativePos = rotate_vertex_position(relativePos, nCenter, angle);

    // vec3 newPos = aCenter + relativePos + posOffset;

    // gl_Position = uPMatrix * uMVMatrix * vec4(newPos, 1.0);
    // vTextureCoord = aTextureCoord;
    
    // vTextureCoord = aTextureCoord;

    vec3 newPosition = rotate_vertex_position(relativePos, axisAngle.xyz, axisAngle.w);
  	newPosition += aCenter;

  	vec4 mvPosition = uMVMatrix * vec4( newPosition, 1.0 );
   	vViewPosition = -mvPosition.xyz;

  	gl_Position = uPMatrix * uMVMatrix * vec4(newPosition, 1.0);

    vColor = aVertexColor;
}