precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform sampler2D textureNormal;
uniform sampler2D textureBg;

void main(void) {
	vec2 uv = vTextureCoord;
	
	vec4 color = texture2D(texture, uv);
	vec3 normal = texture2D(textureNormal, uv).rgb;
	normal = (normal - .5) * 2.0;

	uv += normal.rg * .2;
	vec3 refract = texture2D(textureBg, uv).rgb;
	color.rgb += refract;

    gl_FragColor = color;
}