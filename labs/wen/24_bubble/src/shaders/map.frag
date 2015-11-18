precision mediump float;
const vec2 center = vec2(.5);
varying float vDepth;

const float PI = 3.141592653;

void main(void) {
	float dist = distance(gl_PointCoord, center);
	if(dist > .5) discard;
    gl_FragColor = vec4(1.0);
    float offset = cos(dist/.5 * PI * .5);
    // gl_FragColor.a *= sin(PI * vDepth) * offset;
    float t = sin(PI * vDepth);
    gl_FragColor.a *= pow(t, 3.0) * offset;

    // float alpha = sin(vDepth * PI);
    // gl_FragColor = vec4(vec3(vDepth), alpha);
}