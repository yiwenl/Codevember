precision mediump float;

varying vec3 vColor;
const vec2 center = vec2(.5);

void main(void) {
	if(distance(center, gl_PointCoord) > .5) discard;
    gl_FragColor = vec4(vColor, 1.0);
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}