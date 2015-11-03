// sphere.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aCenter;
attribute vec3 aNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float time;

varying vec2 vTextureCoord;
varying vec3 vCenter;
varying vec3 vNormal;

float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}

float exponentialOut(float t) {
  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}

void main(void) {
    float lengthCenter = length(aCenter);
    float scale = (sin(aCenter.x * .01 + time) * cos(aCenter.y * .02 + time) * sin(aCenter.z * .015 + time)) * .5 + .5;
    
    scale = smoothstep(0.5, 1.0, scale);
    // scale = exponentialIn(scale);

    scale = 1.0 + scale * .5;
    float r = lengthCenter * scale;
    vec3 newCenter = normalize(aCenter) * r;
    vec3 posOffset = newCenter - aCenter;
    vec3 newPos = aVertexPosition + posOffset;

    gl_Position = uPMatrix * uMVMatrix * vec4(newPos, 1.0);
    vTextureCoord = aTextureCoord;

    vNormal = aNormal;
}