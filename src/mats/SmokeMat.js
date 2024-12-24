import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import guid from 'short-uuid';
import { DoubleSide } from 'three';

const uniforms = {
  uTime: 0,
  uPerlinTexture: null,
  side: DoubleSide,
  transparent: true,
  depthWrite: false
};

const vertShader = /* glsl */`

  uniform float uTime;
  uniform sampler2D uPerlinTexture;

  varying vec2 vUv;

  vec2 rotate2D(vec2 value, float angle) {
      float s = sin(angle);
      float c = cos(angle);
      mat2 m = mat2(c, s, -s, c);
      return m * value;
  }

  void main() {
    vec3 newPosition = position;

    // Twist
    float twistPerlin = texture(
        uPerlinTexture,
        vec2(0.5, uv.y * 0.2 - uTime * 0.005)
    ).r;
    float angle = twistPerlin * 10.0;
    newPosition.xz = rotate2D(newPosition.xz, angle);

    // Wind
    vec2 windOffset = vec2(
        texture(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5,
        texture(uPerlinTexture, vec2(0.75, uTime * 0.01)).r - 0.5
    );
    windOffset *= pow(uv.y, 2.0) * 2.0;
    newPosition.xz += windOffset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    vUv = uv;    
  }
`;

const fragShader = /* glsl */`
  uniform float uTime;
  uniform sampler2D uPerlinTexture;

  varying vec2 vUv;

  void main() {
    // Scale and animate
    vec2 smokeUv = vUv;
    smokeUv.x *= 0.5;
    smokeUv.y *= 0.3;
    smokeUv.y -= uTime * 0.03;

    // Smoke
    float smoke = texture(uPerlinTexture, smokeUv).r;

    // Remap
    smoke = smoothstep(0.1, 1.0, smoke);

    // Edges
    smoke *= smoothstep(0.0, 0.1, vUv.x);
    smoke *= smoothstep(1.0, 0.9, vUv.x);
    //smoke *= smoothstep(0.0, 0.3, vUv.y);
    smoke *= smoothstep(1., 0.1, vUv.y);

    // Final color
    //gl_FragColor = vec4(0.6, 0.3, 0.2, smoke);
    gl_FragColor = vec4(vec3(.7), smoke*.3);
  }
`;

const SmokeMat = shaderMaterial(uniforms, vertShader, fragShader);

SmokeMat.key = guid.generate();

extend({ SmokeMat });

export default SmokeMat;
