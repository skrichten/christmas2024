import { shaderMaterial } from '@react-three/drei';
import { Color } from 'three';

const StarMatBuilder = (usePoints = true) => {
  let uniforms = {
    uTime: 0,
    uSize: 1,
    uSizeSpeed: 5,
    uRayStrength: 1,
    uColor1: new Color(0x5000ff),
    uColor2: new Color(0x5000ff),
    uAlpha: 1,
    depthWrite: false,
  };

  const vertShader = `
    uniform float uTime;
    uniform float uSize;
    uniform float uSizeSpeed;
    uniform vec3 uColor1;
    uniform vec3 uColor2;

    ${
      !usePoints
        ? `
      attribute vec3 offset;
    `
        : ''
    }
    attribute float size;
    varying vec4 pColor;
    varying vec2 vUv;

    float random(vec2 co){
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec3 pos = ${usePoints ? 'position' : 'offset'};
      float rand = random(vec2(size));
      float rand2 = random(vec2(size, pos.x));
      float twinkleSpeed = uTime * uSizeSpeed;
      float cycle = sin(twinkleSpeed * rand);
      cycle += sin(.7 + (twinkleSpeed * rand2));
      cycle += sin(.5 + rand2 - (twinkleSpeed));

      

      ${
        usePoints
          ? `
        // modelMatrix is one of the automatically attached uniforms when using the Mesh class
        vec4 mPos = modelMatrix * vec4(pos, 1.0);

        // get the model view position so that we can scale the points off into the distance
        vec4 mvPos = viewMatrix * mPos;

        //animate size over time
        //gl_PointSize = mix(10., uSize * size, cycle);
        gl_PointSize = 1.;

        gl_Position = projectionMatrix * mvPos;

      `
          : `

        vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

        //animate size over time
        //float scale = mix(uSize, uSize * size, cycle);
        //float scale = uSize * size * cycle;
        float scale = max(uSize * size * cycle * .25, .1);

        mvPosition.xyz += position * scale;
        gl_Position = projectionMatrix * mvPosition;
      `
      }

      vUv = uv;
      pColor = vec4(mix(uColor2, uColor1, rand), 1.);
    }
  `;

  const fragShader = `
    precision mediump float;
    varying vec4 pColor;
    varying vec2 vUv;
    uniform float uRayStrength;

    mat2 Ro(float a) {
      float s = sin(a), c = cos(a);
      return mat2(c, -s, s, c);
    }

    float Rays(vec2 uv, float strength) {
      return strength * (max(0., 1. - abs(uv.x * uv.y * 30.)));
    }

    void main() {
      ${
        usePoints
          ? `
        vec2 c = 2. * (gl_PointCoord - .5);
      `
          : `
        vec2 c = 2. * (vUv - .5);
      `
      }
      float rays1 = Rays(c, uRayStrength);
      float rays2 = Rays(c * Ro(3.1415/4.), uRayStrength * .1);
      float strength = distance(vUv, vec2(0.6));
      float cRays = (rays1 + rays2) * smoothstep(.8, .2, strength);

      strength = 1. - strength;
      vec3 col = vec3(pow(strength, 10.)) * pColor.rgb;
      col += cRays;
      gl_FragColor = vec4(col * 2., 1.);
    }
  `;

  const ParticleMat = shaderMaterial(uniforms, vertShader, fragShader);

  return ParticleMat;
};

export default StarMatBuilder;
