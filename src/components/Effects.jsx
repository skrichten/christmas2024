import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useThree } from '@react-three/fiber'


export function Effects({ enabled }) {
  
  const vp = useThree((s) => s.viewport);

  if (!enabled) return null;
  
  return (
    <EffectComposer disableNormalPass>          
      <Bloom
        luminanceThreshold={1}
        mipmapBlur
        luminanceSmoothing={.7}
        intensity={4}
        radius={.4 * vp.dpr}
      />

      <Bloom
        luminanceThreshold={3}
        mipmapBlur
        //luminanceSmoothing={.7}
        intensity={6}
        radius={.8 * vp.dpr}
      />    

    </EffectComposer>
  )
}
