precision mediump float;

varying float vOpacity;
varying vec2 vTextureCoord;
uniform sampler2D textureMap;

const vec2 center = vec2(.5);

void main(void) {
	if(distance(center, gl_PointCoord) > .4) discard;

	vec3 color = texture2D(textureMap, vTextureCoord).rgb;
    gl_FragColor = vec4(color, vOpacity);
}