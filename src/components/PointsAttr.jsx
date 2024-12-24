//import { getRandomBetween } from '@/utils/common/helpers/random';
import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';
//import { DynamicDrawUsage } from 'three';

const getRandomBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};

const PointsAttr = ({ geo, instanced, minSize = 0.3, maxSize = 1 }) => {
  const AttributeClass = instanced
    ? 'instancedBufferAttribute'
    : 'bufferAttribute';
  const { gl } = useThree();

  const sizes = useMemo(() => {
    const meshScales = [];
    for (let i = 0; i < geo.attributes.position.count; i++) {
      meshScales[i] = gl.getPixelRatio() * getRandomBetween(minSize, maxSize);
    }
    return new Float32Array(meshScales);
  }, [geo, minSize, maxSize, gl]);

  return geo ? (
    <>
      <AttributeClass
        attach={`attributes-${instanced ? 'offset' : 'position'}`}
        count={geo.attributes.position.count}
        array={geo.attributes.position.array}
        itemSize={3}
        //usage={DynamicDrawUsage}
        onUpdate={(self) => (self.needsUpdate = true)}
      />
      <AttributeClass
        attach="attributes-size"
        count={sizes.length}
        array={sizes}
        itemSize={1}
        //usage={DynamicDrawUsage}
        onUpdate={(self) => (self.needsUpdate = true)}
      />
    </>
  ) : null;
};

PointsAttr.displayName = 'PointsAttr';
export default PointsAttr;
