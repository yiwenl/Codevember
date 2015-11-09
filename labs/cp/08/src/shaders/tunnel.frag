precision mediump float;
precision mediump int;
// varying vec2 vTextureCoord;

uniform mat4 uNMatrix;

uniform sampler2D permTexture;
uniform sampler2D simplexTexture;
uniform sampler2D testTexture;
uniform float time;
uniform float testVar;
uniform float audioEnergy;
uniform float angle;



varying vec3 vViewPosition;


void main(void) {

    #extension GL_OES_standard_derivatives : enable

    vec3 normal  = normalize(cross(dFdx(vViewPosition), dFdy(vViewPosition)));

    const vec3 lightCol1 = vec3( 0.0, 0.0, 0.0 );
    const vec3 lightDir1 = vec3( -1.0, 0.0, 0.0 );
    const float intensity1 = 1.0;

    vec4 lDirection1 = uNMatrix * vec4( lightDir1, 0.0 );
    vec3 lightVec1 = normalize( lDirection1.xyz );

    // point light

    const vec3 lightPos2 = vec3( 20.0, 0.0, -20.0 );
    const vec3 lightCol2 = vec3( 1.0, 0.5, 0.2 );
    const float maxDistance2 = 100.0;
    const float intensity2 = 1.5;

    vec4 lPosition = uNMatrix * vec4( lightPos2, 1.0 );
    vec3 lVector = lPosition.xyz + vViewPosition.xyz;

    vec3 lightVec2 = normalize( lVector );
    float lDistance2 = 1.0 - min( ( length( lVector ) / maxDistance2 ), 1.0 );

    // point light

    const vec3 lightPos3 = vec3( -20.0, 0.0, -20.0 );
    const vec3 lightCol3 = vec3(0.1, 1.0, 1.0 );
    float maxDistance3 = 100.0;
    const float intensity3 = 1.5;

    vec4 lPosition3 = uNMatrix * vec4( lightPos3, 1.0 );
    vec3 lVector3 = lPosition3.xyz + vViewPosition.xyz;

    vec3 lightVec3 = normalize( lVector3 );
    float lDistance3 = 1.0 - min( ( length( lVector3 ) / maxDistance3 ), 1.0 );

    //

    float diffuse1 = intensity1 * max( dot( normal, lightVec1 ), 0.0 );
    float diffuse2 = intensity2 * max( dot( normal, lightVec2 ), 0.0 ) * lDistance2;
    float diffuse3 = intensity2 * max( dot( normal, lightVec3 ), 0.0 ) * lDistance3;

    // vec3 color = texture2D(testTexture, vec2(vTextureCoord.s, vTextureCoord.t )).rgb;

    gl_FragColor = vec4(diffuse2 * vec3(1,.5,.5) + diffuse3 * vec3(1.0,0.8,0.9), 1.0 );
    // gl_FragColor = vec4(0.5,1.0,1.0,1.0);
   
}