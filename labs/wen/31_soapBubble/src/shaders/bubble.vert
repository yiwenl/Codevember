// bubble.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 normalMatrix;

varying vec2 vTextureCoord;

const float PI = 3.141592657;
vec4 permute(vec4 x) { return mod(((x*34.00)+1.00)*x, 289.00); }
vec4 taylorInvSqrt(vec4 r) { return 1.79 - 0.85 * r; }

float snoise(vec3 v){
	const vec2 C = vec2(1.00/6.00, 1.00/3.00) ;
	const vec4 D = vec4(0.00, 0.50, 1.00, 2.00);
	
	vec3 i = floor(v + dot(v, C.yyy) );
	vec3 x0 = v - i + dot(i, C.xxx) ;
	
	vec3 g = step(x0.yzx, x0.xyz);
	vec3 l = 1.00 - g;
	vec3 i1 = min( g.xyz, l.zxy );
	vec3 i2 = max( g.xyz, l.zxy );
	
	vec3 x1 = x0 - i1 + 1.00 * C.xxx;
	vec3 x2 = x0 - i2 + 2.00 * C.xxx;
	vec3 x3 = x0 - 1. + 3.00 * C.xxx;
	
	i = mod(i, 289.00 );
	vec4 p = permute( permute( permute( i.z + vec4(0.00, i1.z, i2.z, 1.00 )) + i.y + vec4(0.00, i1.y, i2.y, 1.00 )) + i.x + vec4(0.00, i1.x, i2.x, 1.00 ));
	
	float n_ = 1.00/7.00;
	vec3 ns = n_ * D.wyz - D.xzx;
	
	vec4 j = p - 49.00 * floor(p * ns.z *ns.z);
	
	vec4 x_ = floor(j * ns.z);
	vec4 y_ = floor(j - 7.00 * x_ );
	
	vec4 x = x_ *ns.x + ns.yyyy;
	vec4 y = y_ *ns.x + ns.yyyy;
	vec4 h = 1.00 - abs(x) - abs(y);
	
	vec4 b0 = vec4( x.xy, y.xy );
	vec4 b1 = vec4( x.zw, y.zw );
	
	vec4 s0 = floor(b0)*2.00 + 1.00;
	vec4 s1 = floor(b1)*2.00 + 1.00;
	vec4 sh = -step(h, vec4(0.00));
	
	vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
	vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
	
	vec3 p0 = vec3(a0.xy,h.x);
	vec3 p1 = vec3(a0.zw,h.y);
	vec3 p2 = vec3(a1.xy,h.z);
	vec3 p3 = vec3(a1.zw,h.w);
	
	vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
	p0 *= norm.x;
	p1 *= norm.y;
	p2 *= norm.z;
	p3 *= norm.w;
	
	vec4 m = max(0.60 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.00);
	m = m * m;
	return 42.00 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

float snoise(float x, float y, float z){
	return snoise(vec3(x, y, z));
}


uniform float time;
uniform float numSeg;
uniform float scale;
uniform float noiseOffset;
uniform float noiseStrength;

varying vec3 vNormal;
varying vec3 vVertex;
varying vec3 eye;

vec3 getPosition(vec3 values) {
    float rx = values.y / numSeg * PI - PI;
    float ry = values.x / numSeg * PI * 2.0;

    vec3 pos = vec3(0.0);
    pos.y = cos(rx) * values.z;
    float r = sin(rx) * values.z;
    pos.x = cos(ry) * r;
    pos.z = sin(ry) * r;
    return pos; 
} 

vec3 getPosition(float i, float j, float r) {
   return getPosition(vec3(i, j, r*scale));
} 

vec3 getFinalPos(vec3 pos) {
	vec3 noisePos = pos * noiseOffset;
    vec3 tmpPos = normalize(pos) * noiseStrength;
    vec3 posOffset = tmpPos * snoise(noisePos.x + time, noisePos.y + time, noisePos.z + time);
    return pos + posOffset;
}

void main(void) {
	vec3 pos = getPosition(aVertexPosition.x, aVertexPosition.y, aVertexPosition.z);
    vec3 p0  = getPosition(aVertexPosition.x+1.0, aVertexPosition.y, aVertexPosition.z);
    vec3 p1  = getPosition(aVertexPosition.x, aVertexPosition.y+1.0, aVertexPosition.z);

    vec3 finalPos  = getFinalPos(pos);
    vec3 finalPos0 = getFinalPos(p0);
    vec3 finalPos1 = getFinalPos(p1);
    
    vec3 v0 = finalPos0 - finalPos;
    vec3 v1 = finalPos1 - finalPos;

    if(length(v0) == 0.0) {
        float gap = .01;

        if(aVertexPosition.y < 1.0) {
            pos = getPosition(aVertexPosition.x, aVertexPosition.y+gap, aVertexPosition.z);
            p0  = getPosition(aVertexPosition.x+1.0, aVertexPosition.y+gap, aVertexPosition.z);
        } else {
            pos = getPosition(aVertexPosition.x, aVertexPosition.y-gap, aVertexPosition.z);
            p0  = getPosition(aVertexPosition.x+1.0, aVertexPosition.y-gap, aVertexPosition.z);
        }

        vec3 newP = getFinalPos(pos);
        vec3 newP0 = getFinalPos(p0);
        v0 = newP0 - newP;
    } 

	vec3 vCross     = cross(v1, v0);
	vec4 mvPosition = uMVMatrix * vec4( finalPos, 1.0);
	gl_Position     = uPMatrix * mvPosition;
	vTextureCoord   = aTextureCoord;
	vVertex         = pos;
	vNormal         = normalize( normalMatrix * vCross );
	eye             = normalize( mvPosition.rgb );
}