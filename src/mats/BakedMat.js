import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import guid from 'short-uuid';
import { Color } from 'three';

const uniforms = {
  uReveal1: 0.5,
  uReveal2: 0.5,
  uReveal3: 0.5,
  uReveal4: 0,
  uBakedTex: null,
  uLightMapTex: null,
  uLight1Strength: 1,
  uLight2Strength: 1,
  uLight3Strength: 1,
  uLight4Strength: 0,
  uLight1Color: new Color(1, 0, 0),
  uLight2Color: new Color(0, 1, 0),
  uLight3Color: new Color(0, 0, 1),
  uLight4Color: new Color(0, 0, 0),
};

const vertShader = /* glsl */`
  varying vec2 vUv;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    vUv = uv;
  }
`;

const fragShader = /* glsl */`

  float blendAdd(float base, float blend) {
    return min(base+blend,1.0);
  }

  vec3 blendAdd(vec3 base, vec3 blend) {
    return min(base+blend,vec3(1.0));
  }

  vec3 blendAdd(vec3 base, vec3 blend, float opacity) {
    return (blendAdd(base, blend) * opacity + base * (1.0 - opacity));
  }

  varying vec2 vUv;
  uniform sampler2D uBakedTex;
  uniform sampler2D uLightMapTex;
  uniform float uLight1Strength;
  uniform float uLight2Strength;
  uniform float uLight3Strength;
  uniform float uLight4Strength;
  uniform float uReveal1;
  uniform float uReveal2;
  uniform float uReveal3;
  uniform float uReveal4;
  uniform vec3 uLight1Color;
  uniform vec3 uLight2Color;
  uniform vec3 uLight3Color;
  uniform vec3 uLight4Color;

  void main() {
    vec3 bakedColor = texture2D(uBakedTex, vUv).rgb;
    vec4 lightColor = texture2D(uLightMapTex, vUv);

    // the baked maps are too bright, so we darken them a bit
    //bakedColor *= .5;
    lightColor *= .7;
    
    float light1Strength = lightColor.g * uLight1Strength * uReveal1;
    float light2Strength = lightColor.b * uLight2Strength * uReveal2;
    float light3Strength = lightColor.r * uLight3Strength * uReveal3;
    float light4Strength = lightColor.a * uLight4Strength * uReveal4;

    bakedColor = blendAdd(bakedColor, uLight1Color, light1Strength); 
    bakedColor = blendAdd(bakedColor, uLight2Color, light2Strength);
    bakedColor = blendAdd(bakedColor, uLight3Color, light3Strength);
    bakedColor = blendAdd(bakedColor, uLight4Color, light4Strength);
    
    gl_FragColor = vec4(bakedColor, 1.);
  }
`;

const BakedMat = shaderMaterial(uniforms, vertShader, fragShader);

BakedMat.key = guid.generate();

extend({ BakedMat });

export default BakedMat;
