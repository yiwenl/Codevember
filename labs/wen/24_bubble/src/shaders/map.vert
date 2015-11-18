precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D texture;
varying float vDepth;

float contrast(float value, float scale, float midPoint) {
	return clamp( midPoint + (value - midPoint) * scale, 0.0, 1.0);
}

float contrast(float value, float scale) {
	return contrast(value, scale, .5);
}
	
float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}

void main(void) {
	vec3 pos = aVertexPosition;
	pos.xyz = texture2D(texture, aTextureCoord ).xyz;


	vec4 V = uPMatrix * uMVMatrix * vec4(pos, 1.0);
	float depth = getDepth(V.z/V.w, 5.0, 1000.0);
	depth = clamp(depth, 0.0, 1.0);
	depth = contrast(depth, 4.0, .4);
    gl_Position = V;

    gl_PointSize = 1.0 + pow(2.0, (1.0-depth) * 6.5);
    vDepth = depth;
}