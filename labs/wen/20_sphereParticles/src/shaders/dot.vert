// dot.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec3 position;

varying vec2 vTextureCoord;

mat3 setCamera( in vec3 ro, in vec3 ta, float cr ) {
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

void main(void) {
	float size 	   = abs(aVertexPosition.x);
	vec3 ta        = vec3( 0.0, 0.0, 0.0 );
	mat3 ca        = setCamera( position, ta, 0.0 );
	vec3 dir       = ca * normalize( aVertexPosition )* size;
	vec3 pos 	   = dir * size + position; 

    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
}