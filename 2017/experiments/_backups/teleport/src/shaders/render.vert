// render.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aNormal;
attribute vec3 aPosOffset;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uShadowMatrix;
uniform sampler2D texturePos;
uniform sampler2D textureExtra;
uniform float uTime;
uniform vec2 uViewport;
uniform vec4 uRotation;

varying vec4 vColor;
varying vec3 vNormal;
varying vec4 vShadowCoord;

const float radius = 0.005;

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

vec3 rotate(vec3 v) {
	return rotate(v * uRotation.x, aExtra, uRotation.w + uTime);
}

void main(void) {
	vec2 uv      = aVertexPosition.xy;
	vec3 pos     = texture2D(texturePos, uv).rgb + rotate(aPosOffset);
	vec3 extra   = texture2D(textureExtra, uv).rgb;
	vec4 wsPosition  = uModelMatrix * vec4(pos, 1.0);
	gl_Position  = uProjectionMatrix * uViewMatrix * wsPosition;
	

	// float g 	 = sin(extra.r + time * mix(extra.b, 1.0, .5));
	// g 			 = smoothstep(0.0, 1.0, g);
	// g 			 = mix(g, 1.0, .75);
	vColor       = vec4(extra, 1.0);

	float distOffset = uViewport.y * uProjectionMatrix[1][1] * radius / gl_Position.w;
    gl_PointSize = distOffset;

	vNormal 	 = aNormal;
	vShadowCoord = uShadowMatrix * wsPosition;
}