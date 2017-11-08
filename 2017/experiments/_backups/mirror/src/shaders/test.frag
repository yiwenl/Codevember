// copy.frag
precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D textureNormal;

void main(void) {
    vec3 N = texture2D(textureNormal, vTextureCoord).rgb;
    N = N * 2.0 - 1.0;

    gl_FragColor = vec4(N, 1.0);
}