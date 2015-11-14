// line.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D texture;
varying vec2 vTextureCoord;
varying vec3 vColor;


mat3 setCamera( in vec3 ro, in vec3 ta, float cr ) {
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}


void main(void) {
	vec3 pos       = aVertexPosition;
	vec2 uv        = aTextureCoord * .5;
	vec3 posOffset = texture2D(texture, uv).rgb;
	vec3 ta        = vec3( 0.0, 0.0, 0.0 );
	mat3 ca        = setCamera( posOffset, ta, 0.0 );
	vec3 dir       = ca * normalize( pos );
	dir            += posOffset;
	gl_Position    = uPMatrix * uMVMatrix * vec4(dir, 1.0);
	vTextureCoord  = aTextureCoord;
	
	vColor         = vec3(1.0);
}