import { useTexture } from '@react-three/drei';
import SmokeMat from '../mats/SmokeMat';
import * as React from 'react';
import { NoColorSpace, PlaneGeometry, RepeatWrapping } from 'three';
import { useFrame } from '@react-three/fiber';


const smokeGeometry = new PlaneGeometry(.5, 1, 16, 64)
smokeGeometry.translate(0, 0.5, 0)
smokeGeometry.scale(1.5, 5, 1.5)

export const Smoke = ({...props}) => {
  const matRef = React.useRef();

  const perTex = useTexture('/perlin.png');
  perTex.wrapS = perTex.wrapT = RepeatWrapping;
  perTex.colorSpace = NoColorSpace;


  useFrame((state, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <group {...props}>
      <mesh geometry={smokeGeometry}>        
        {/*<meshBasicMaterial color="green" wireframe />*/}
        <smokeMat uPerlinTexture={perTex} ref={matRef} /> 
      </mesh>
    </group>
  );
}
