precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

uniform vec3 uAmbientColor;

uniform vec3 uPointLightingLocation;
uniform vec3 uPointLightingColor;

// uniform vec3 uLightingDirection;
// uniform vec3 uDirectionalColor;

varying vec3 vColor;

// varying bool uUseLighting;
varying vec3 vLightWeighting;

// varying vec3 vFragVert;
// varying vec3 vFragNormal;

varying vec3 vVertexPos;

void main(void) {
	vec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
    gl_Position = uPMatrix * mvPosition;
    // gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    // vTextureCoord = aTextureCoord;

    vColor = aVertexColor;

    // vFragNormal = aVertexNormal;
    // vFragVert = aVertexPosition;

    vVertexPos = aVertexPosition;
  
    vec3 lightDirection = normalize(uPointLightingLocation - mvPosition.xyz);

    vec3 transformedNormal = uNMatrix * aVertexNormal;
    float directionalLightWeighting = max(dot(transformedNormal, lightDirection), 0.0);
    vLightWeighting = uAmbientColor + uPointLightingColor * directionalLightWeighting;



}