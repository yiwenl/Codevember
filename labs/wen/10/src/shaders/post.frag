// post.frag
#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform sampler2D textureBg;

void main(void) {
	vec2 uv = vTextureCoord;
	vec4 colorBox = texture2D(texture, vTextureCoord) * .5;

	vec2 uvOffset = colorBox.rg - vec2(.5);
	uv += uvOffset * .1;
    gl_FragColor = texture2D(textureBg, uv);
    gl_FragColor.a *= mix(colorBox.a, 1.0, .1);
}