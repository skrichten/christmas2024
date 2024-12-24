import useAudio from '../util/useAudio';
import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import { useGeneralStore } from '../store';
import { useShallow } from 'zustand/react/shallow';
import { useControls } from 'leva';
import gsap from 'gsap';

export const AudioViz = () => {
  const [
    tree1Mat, tree2Mat, tree3Mat, houseMat, groundMat
  ] = useGeneralStore(useShallow((s) => [
    s.tree1Mat, s.tree2Mat, s.tree3Mat, s.houseMat, s.groundMat
  ]));
  const savedVal = React.useRef(false);
  const [audioURL, setAudioURL] = React.useState(false);
  const audio = useAudio(audioURL, 32);

  const handleToggle = (val) => {
    if (!val && audio) {
      audio.context.suspend();
      setTimeout(() => {
        tree2Mat.uniforms.uTurbFactor.value = .17;
        tree3Mat.uniforms.uTurbFactor.value = .17;
        tree1Mat.uniforms.uTurbFactor.value = .17;
        houseMat.uniforms.uLight4Strength.value = savedVal.current;
      }, 200);
    } else if (val) {
      savedVal.current = houseMat.uniforms.uLight4Strength.value;
      if (audio && audioURL) {
        audio.context.resume();
      } else {
        setAudioURL('/cozy-holidays.mp3');
      }
    }
  };

  const ctrls = useControls('Audio', {
    musicToggle: {
      label: 'Music',
      value: false,
      onChange: handleToggle,
      transient: false,
    },
    
  }, { collapsed: true }, [audio, audioURL, setAudioURL, houseMat]);

  useFrame(() => {
    if (!tree1Mat || !audio || !ctrls.musicToggle) return;

    audio.update(); 
    //const avg = audio.update();    
    
    //const t1 = Math.max(.2, gsap.utils.mapRange(30, 55, 0, .5, avg));
    //tree1Mat.uniforms.uTurbFactor.value = t1;
    let t2 = audio.data[4];
    const h = savedVal.current*.7 + gsap.utils.mapRange(0, 255, 0, 1, t2);
    houseMat.uniforms.uLight4Strength.value = h;
    groundMat.uniforms.uLight4Strength.value = h;
    t2 = Math.max(.07, gsap.utils.mapRange(10, 60, .1, .33, t2));
    tree2Mat.uniforms.uTurbFactor.value = t2;
    tree3Mat.uniforms.uTurbFactor.value = t2;
    tree1Mat.uniforms.uTurbFactor.value = t2;

    
  });

  return null;
}

/*
Music from #Uppbeat (free for Creators!):
https://uppbeat.io/t/soundroll/cozy-holidays
License code: FVW3UCW25WA7INCX
*/
