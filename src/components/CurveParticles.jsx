import  * as React from 'react';

export const CurveParticles = ({
  count=10000,
  children,
  ...props
}) => { 
  const { samples, speeds, positions, turbPos } = React.useMemo(() => {
    const samples = new Float32Array(count);
    const speeds = new Float32Array(count);
    const positions = new Float32Array(count * 3);
    const turbPos = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      samples[i] = Math.random();
      speeds[i] = Math.random() + .4;
      turbPos[i] = Math.random();
      // Position values actually used for random size(x) and alpha(y).
      positions.set([Math.random() * 2.2 + .5 , Math.random() * .7 + .2, 0], i * 3);
    }
    return { samples, speeds, positions, turbPos };
  }
  , [count]);

  return (    
    <points scale={1} {...props}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandomSample" args={[samples, 1]} />
        <bufferAttribute attach="attributes-aRandomSpeed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-aTurbPos" args={[turbPos, 1]} />
      </bufferGeometry>

      {children}

    </points>
  )
}
