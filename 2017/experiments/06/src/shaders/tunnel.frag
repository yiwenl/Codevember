
precision highp float;
varying vec2 vTextureCoord;
varying vec3 vPosition;

uniform sampler2D texture;
uniform float uTime;

void main(void) {
	vec2 uv = vTextureCoord;
	uv.y = mod(uv.y - uTime, 1.0);
	uv.x = mod(uv.x + vPosition.z * 0.05, 1.0);
    gl_FragColor = texture2D(texture, uv);
}