precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform sampler2D textureNormal;
uniform sampler2D textureOrgNormal;
uniform sampler2D textureBg;

const vec3 front = vec3(0.0, 0.0, 1.0);

void main(void) {
	vec2 uv = vTextureCoord;
	
	vec4 color = texture2D(texture, uv);
	vec3 normal = texture2D(textureNormal, uv).rgb;
	normal = (normal - .5) * 2.0;
	vec3 normalOrg = texture2D(textureOrgNormal, uv).rgb;
	normalOrg = (normalOrg - .5) * 2.0;

	float dirOffset = pow(dot(normalOrg, front), 2.0);
	dirOffset = mix(dirOffset, 1.0, .2);
	dirOffset = smoothstep(0.0, .7, dirOffset);

	uv += normal.rg * .2;
	vec3 refract = texture2D(textureBg, uv).rgb;
	color.rgb += refract;

	// color.rgb = vec3(dirOffset);
	color.rgb *= dirOffset;

    gl_FragColor = color;
}