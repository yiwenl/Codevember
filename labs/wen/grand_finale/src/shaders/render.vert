// line.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D texture;
varying vec2 vTextureCoord;
varying vec3 vColor;

void main(void) {
	vec3 pos = aVertexPosition;
	vec2 uv = aTextureCoord * .5;
	vec2 uvExtra = uv + vec2(.5);
	pos.xyz = texture2D(texture, uv).rgb;
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;

    vec3 extra = texture2D(texture, uvExtra).rgb;

    gl_PointSize = 1.0 + extra.x * 5.0;
    vColor = aColor;
}