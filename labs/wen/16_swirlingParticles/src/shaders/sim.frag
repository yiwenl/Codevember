// sim.frag

precision mediump float;
uniform sampler2D texture;
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

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 getPosition(vec3 value) {
	vec3 pos;

	pos.y = value.y;
	pos.x = cos(value.z) * value.x;
	pos.z = sin(value.z) * value.x;
	return pos;
}



uniform float time;
const float range = 250.0;
const float mixture = .5;
const float radius = 400.0;
const float minRadius = 1.0;

float cubicIn(float t) {
  return t * t * t;
}

float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}

float exponentialOut(float t) {
  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}


void main(void) {
    if(vTextureCoord.y < .5) {
		if(vTextureCoord.x < .5) {
			vec2 uvVel  = vTextureCoord + vec2(.5, .0);
			vec3 pos    = texture2D(texture, vTextureCoord).rgb;
			vec3 vel    = texture2D(texture, uvVel).rgb;

			pos += vel;
			// if(pos.x < .1) pos.x = 0.1;
			pos.x = max(pos.x, 1.0);
			if(pos.z > PI * 2.0) pos.z -= PI * 2.0;

			if(pos.y > range) {
				pos.y = -range - 10.0;
				float randR = (rand(vec2(time))*.3) * .9;
				pos.x = randR * radius * 1.5;
			}
			gl_FragColor = vec4(pos, 1.0);
		} else {
			vec2 uvPos      = vTextureCoord - vec2(0.5, 0.0);
			vec2 uvExtra    = vTextureCoord + vec2(0.0, 0.5);
			vec3 orgPos 	= texture2D(texture, uvPos).rgb;
			vec3 vel 		= texture2D(texture, vTextureCoord).rgb;
			vec3 extra 		= texture2D(texture, uvExtra).rgb;
			vec3 pos 		= getPosition(orgPos);
			float yOffset 	= 1.0 - (pos.y + range) / (range * 2.0);
			
			const float posOffset = .01;
			const float mixOffset = .95;
			float aRotation = .0005 * mix(extra.x, 1.0, mixOffset);
			float aRadius   = .01 * mix(extra.y, 1.0, mixOffset);
			float aY 		= .005 * mix(extra.z, 1.0, mixOffset) + (1.0-yOffset) * .005;
			
			float ax 		= snoise(pos.x*posOffset+time, pos.y*posOffset+time, pos.z*posOffset+time) * aRadius;
			float ay 		= (snoise(pos.y*posOffset+time, pos.z*posOffset+time, pos.x*posOffset+time) + .85) * aY;
			float az 		= (snoise(pos.z*posOffset+time, pos.x*posOffset+time, pos.y*posOffset+time) + .85) * aRotation;

			vel += vec3(ax, ay, az);

			float minRadius = 10.0;
			// float ty = 
			float maxRadius = radius * exponentialIn(mix(yOffset, 1.0, .2));
			if(orgPos.x < minRadius) {
				vel.x += 1.0/(orgPos.x/minRadius) * .01;
			} else if(orgPos.x > maxRadius) {
				vel.x -= (orgPos.x - maxRadius) * .00015;
			}

			const float maxRotationSpeed = .1;
			if(vel.z > maxRotationSpeed) {
				vel.z -= (vel.z - maxRotationSpeed) * .1;
			}
			//	DECREASE
			vel *= .975;
			gl_FragColor = vec4(vel, 1.0);	
		}
    } else {
    	gl_FragColor = texture2D(texture, vTextureCoord);
    }
}