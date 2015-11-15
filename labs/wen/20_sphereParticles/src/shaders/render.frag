precision mediump float;

varying vec2 vTextureCoord;
varying float vOpacity;
uniform sampler2D textureParticle;


void main(void) {
    gl_FragColor = texture2D(textureParticle, vTextureCoord);
    gl_FragColor.rgb *= gl_FragColor.a;
    gl_FragColor *= vOpacity;
}