precision mediump float;

uniform sampler2D texture;
uniform sampler2D textureGrd;
varying vec2 vTextureCoord;

vec3 blendOverlay(vec3 base, vec3 blend) {
    return mix(1.0 - 2.0 * (1.0 - base) * (1.0 - blend), 2.0 * base * blend, step(base, vec3(0.5)));
}

void main(void) {
	vec4 color0 = texture2D(texture, vTextureCoord);
	vec4 color1 = texture2D(textureGrd, vTextureCoord);

    // gl_FragColor = vec4(blendOverlay(color0.rgb, color1.rgb), 1.0);
   

    gl_FragColor = color0;
    gl_FragColor.rgb = blendOverlay(color0.rgb, color1.rgb);
}