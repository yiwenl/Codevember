// normal.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;

const float gap = 0.01;
const float hOffset = .1;

void main(void) {
	vec2 uv = vTextureCoord;
	vec2 uvRight = uv + vec2(gap, 0.0);
	vec2 uvBottom = uv + vec2(0.0, gap);
	float h = texture2D(texture, uv).r;
	float hRight = texture2D(texture, uvRight).r;
	float hBottom = texture2D(texture, uvBottom).r;

	vec3 pCurr = vec3(0.0, 0.0, h);
	vec3 pRight = vec3(gap, 0.0, hRight);
	vec3 pBottom = vec3(0.0, gap, hBottom);

	vec3 vRight = pRight - pCurr;
	vec3 vBottom = pBottom - pCurr;
	// vec3 normal = cross(vBottom, vRight);
	vec3 normal = cross(vRight, vBottom);
	normal = normalize(normal) * .5 + .5;


    gl_FragColor = vec4(normal, 1.0);
}