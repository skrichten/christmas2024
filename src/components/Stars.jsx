import { useGLTF } from '@react-three/drei';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { AdditiveBlending, Color, PlaneGeometry } from 'three';

import StarMatBuilder from '../mats/StarMatBuilder';
import PointsAttr from './PointsAttr';

const StarsMat = StarMatBuilder(false);
extend({ StarsMat });

const particleGeo = new PlaneGeometry(1, 1);

const colors = {
  pCol1: new Color(0x8ee1ff),
  pCol2: new Color(0x5000ff),
};

const Stars = () => {
  const matRef = useRef();
  const gl = useThree((state) => state.gl);
  const { nodes } = useGLTF('/stars.glb');

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh scale={[1.5, 1.5, 1.5]} position={[0, 0, 0]} frustumCulled={false}>
      <instancedBufferGeometry
        attach="geometry"
        index={particleGeo.index}
        attributes={particleGeo.attributes}
      >
        <PointsAttr
          instanced
          geo={nodes.Stars.geometry}
          destGeometry={null}
          minSize={0.9}
          maxSize={1.5}
        />
      </instancedBufferGeometry>
      <starsMat
        attach="material"
        uSize={.3 / gl.getPixelRatio()}
        //uSize={2}
        uColor1={colors.pCol1}
        uColor2={colors.pCol2}
        uRayStrength={0.2}
        //uSizeSpeed={0}
        uSizeSpeed={10}
        ref={matRef}
        blending={AdditiveBlending}
      />
    </mesh>
  );
};

export default Stars;
