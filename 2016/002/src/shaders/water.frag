// water.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec4 vClipSpace;
varying vec2 vTextureCoord;
uniform sampler2D textureReflection;
uniform sampler2D textureRefraction;

void main(void) {
	vec2 ndc = vClipSpace.xy / vClipSpace.w;
	ndc = ndc * 0.5 + 0.5;

	vec2 uvRefract = vec2(ndc);
	vec2 uvReflect = vec2(ndc.x, 1.0-ndc.y);

	vec4 colorReflection = texture2D(textureReflection, uvReflect);
	vec4 colorRefraction = texture2D(textureRefraction, uvRefract);
	// colorReflection.rg *= 0.5;
    gl_FragColor = mix(colorReflection, colorRefraction, .5);
    // gl_FragColor = colorReflection;
    gl_FragColor.rgb *= 0.5;
    // gl_FragColor = vec4(ndc, 0.0, 1.0);
}