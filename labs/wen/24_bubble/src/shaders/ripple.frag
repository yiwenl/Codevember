precision mediump float;

vec4 permute(vec4 x) {  return mod(((x*34.0)+1.0)*x, 289.0);    }
vec4 taylorInvSqrt(vec4 r) {    return 1.79284291400159 - 0.85373472095314 * r; }

mat4 rotateZ(float psi){
    return mat4(
        vec4(cos(psi),-sin(psi),0.,0),
        vec4(sin(psi),cos(psi),0.,0.),
        vec4(0.,0.,1.,0.),
        vec4(0.,0.,0.,1.));
}


vec3 rotateZ(vec3 v, float theta) {
    mat4 mtx = rotateZ(theta);
    vec4 newV = mtx * vec4(v, 1.0) ;
    return newV.xyz;
}


float map(float value, float sx, float sy, float tx, float ty) {
    float p = ( value - sx ) / ( sy - sx );
    if(p < .0) p = .0;
    else if(p > 1.0) p = 1.0;
    return tx + ( ty - tx ) * p;
}

varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform float time;

const float PI      = 3.141592653;
const float radius  = .5;

const float waveLength = .05;

uniform vec2 waveCenter0;
uniform float waveFront0;
uniform float waveLength0;

uniform vec2 waveCenter1;
uniform float waveFront1;
uniform float waveLength1;

uniform vec2 waveCenter2;
uniform float waveFront2;
uniform float waveLength2;

uniform vec2 waveCenter3;
uniform float waveFront3;
uniform float waveLength3;

uniform vec2 waveCenter4;
uniform float waveFront4;
uniform float waveLength4;

uniform vec2 waveCenter5;
uniform float waveFront5;
uniform float waveLength5;

uniform vec2 waveCenter6;
uniform float waveFront6;
uniform float waveLength6;

uniform vec2 waveCenter7;
uniform float waveFront7;
uniform float waveLength7;

uniform vec2 waveCenter8;
uniform float waveFront8;
uniform float waveLength8;

uniform vec2 waveCenter9;
uniform float waveFront9;
uniform float waveLength9;

const vec2 center = vec2(.5);


uniform vec3 color0;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;


const float waveSize = .0;
uniform float generalWaveHeight;
uniform float showFullPerlinColors;
uniform float aspectRatio;

float contrast(float value, float scale) {  return (value - .5) * scale + .5;   }

float getWaveHeight(vec2 uv, vec2 waveCenter, float waveFront, float waveLength) {
    float distToWave = distance(uv, waveCenter);    
    if( abs(distToWave - waveFront) < waveLength) {   return (1.0 - sin(abs(distToWave - waveFront)/waveLength * PI * .5)) * generalWaveHeight; }
    else return 0.0;
}

void main(void) {
	vec2 uv = vTextureCoord;
    uv.x = contrast(uv.x, aspectRatio);
    
	float waveHeight = 0.0;
	vec4 colorOrg = texture2D(texture, uv);

    waveHeight += getWaveHeight(uv, waveCenter0, waveFront0, waveLength0);
    waveHeight += getWaveHeight(uv, waveCenter1, waveFront1, waveLength1);
    waveHeight += getWaveHeight(uv, waveCenter2, waveFront2, waveLength2);
    waveHeight += getWaveHeight(uv, waveCenter3, waveFront3, waveLength3);
    waveHeight += getWaveHeight(uv, waveCenter4, waveFront4, waveLength4);
    waveHeight += getWaveHeight(uv, waveCenter5, waveFront5, waveLength5);
    waveHeight += getWaveHeight(uv, waveCenter6, waveFront6, waveLength6);
    waveHeight += getWaveHeight(uv, waveCenter7, waveFront7, waveLength7);
    waveHeight += getWaveHeight(uv, waveCenter8, waveFront8, waveLength8);
    waveHeight += getWaveHeight(uv, waveCenter9, waveFront9, waveLength9);

    float blend = waveHeight;
    vec3 c1;
    vec3 c2;
    float offset;

    if(blend < .25) {
        c1 = color0;
        c2 = color1;
        offset = blend;
    } else if(blend < .5) {
        c1 = color1;
        c2 = color2;
        offset = blend-.25;
    } else if(blend < .75) {
        c1 = color2;
        c2 = color3;
        offset = blend-.5;
    } else {
        c1 = color3;
        c2 = color4;
        offset = blend-.75;
    } 

    vec3 color = mix(c1, c2, offset/.25);
    
    gl_FragColor = vec4(color, waveHeight+showFullPerlinColors);
    
}