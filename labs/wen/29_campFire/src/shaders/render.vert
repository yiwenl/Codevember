// line.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aExtra;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float time;
uniform sampler2D texture;
varying vec2 vTextureCoord;
varying float vOpacity;

vec3 getPos(vec3 value) {
	vec3 pos;

	pos.y = value.y;
	pos.x = cos(value.z) * value.x;
	pos.z = sin(value.z) * value.x;
	return pos;
}

void main(void) {
	vec3 pos = getPos(aVertexPosition);
	vec2 uv = aTextureCoord * .5;
	pos.xyz = texture2D(texture, uv).rgb;
	pos = getPos(pos);
	pos.y += 25.0;
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vTextureCoord = aExtra.xy;

    gl_PointSize = aExtra.z;

    float c = sin(time * mix(aExtra.x, 1.0, .5));
    vOpacity = smoothstep(.5, 1.0, c);
}