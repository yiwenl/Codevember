precision mediump float;

varying vec3 vColor;

uniform sampler2D textureParticle;

void main(void) {

	vec4 colorParticle = texture2D(textureParticle, gl_PointCoord);
	colorParticle.rgb *= vColor * colorParticle.a;

    // gl_FragColor = vec4(vColor, 1.0);
    gl_FragColor = colorParticle;
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}