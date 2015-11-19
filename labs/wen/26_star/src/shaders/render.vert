// line.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aExtra;
attribute vec2 aTextureCoord;
attribute vec2 aUV;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D texture;
uniform sampler2D textureColor;
uniform float time;
varying vec2 vTextureCoord;
varying vec3 vColor;

void main(void) {
	vec3 pos = aVertexPosition;
	vec2 uv = aTextureCoord * .5;
	pos.xyz = texture2D(texture, uv).rgb;
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;

    gl_PointSize = 3.0 + (sin(time*aExtra.x) * .5 + .5) * 3.0;
    // vColor = vec3(0.25);
    float offset = 1.0 - smoothstep(50.0, 120.0, length(pos));

    vec3 colorPixel = texture2D(textureColor, aUV).rgb;
    vColor = vec3(1.0) * offset * colorPixel;
}