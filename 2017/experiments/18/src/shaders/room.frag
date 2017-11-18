// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;

void main(void) {
	vec3 color   = texture2D(texture, vTextureCoord).rgb;
	
	gl_FragColor = vec4(color, 1.0);
}