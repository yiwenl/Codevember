precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform sampler2D textureNormal;
uniform sampler2D textureLight;

void main(void) {
	vec4 normalOrg = texture2D(textureNormal, vTextureCoord);
	vec3 normal = (normalOrg.rgb - vec3(.5)) * 2.0;
	vec2 uv = vTextureCoord + normal.rg * .4;
	vec4 colorBg = texture2D(texture, uv);
	vec4 colorLight = texture2D(textureLight, vTextureCoord);

    gl_FragColor = vec4(colorBg.rgb + colorLight.rgb, normalOrg.a);
}