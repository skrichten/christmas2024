import useAudio from '../util/useAudio';
import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import { useGeneralStore } from '../store';
import { useShallow } from 'zustand/react/shallow';
import { useControls } from 'leva';
import gsap from 'gsap';

export const AudioViz = () => {
  const [
    tree1Mat, tree2Mat, tree3Mat, houseMat, groundMat, enableAudio
  ] = useGeneralStore(useShallow((s) => [
    s.tree1Mat, s.tree2Mat, s.tree3Mat, s.houseMat, s.groundMat, s.enableAudio
  ]));
  const savedVal = React.useRef(false);
  const audio = useAudio('/cozy-holidays.mp3', 32);
  console.log(enableAudio);
  const delay = enableAudio === true ? 4000 : 0;

  const handleToggle = (val) => {
    if (!val && audio?.started) {
      //console.log('audio suspended');
      audio.context.suspend();
      setTimeout(() => {
        tree2Mat.uniforms.uTurbFactor.value = .17;
        tree3Mat.uniforms.uTurbFactor.value = .17;
        tree1Mat.uniforms.uTurbFactor.value = .17;
        houseMat.uniforms.uLight4Strength.value = savedVal.current;
      }, 200);
    } else if (val) {
      savedVal.current = houseMat.uniforms.uLight4Strength.value;
      if (audio && audio.started) {
        //console.log('audio resumed');
        audio.context.resume();
      } else {
        setTimeout(() => {
          audio.gain.connect(audio.context.destination);
          audio.context.resume();
          audio.started = true;
          //console.log('audio started First time');
        }, delay);
      }
    }
  };

  const [ctrls, setCtrls] = useControls(() => ({
    musicToggle: {
      label: 'Music',
      value: false,
      onChange: handleToggle,
      transient: false,
    },
  }), { collapsed: true }, [enableAudio]);

  React.useEffect(() => {
    setCtrls({ musicToggle: enableAudio === true ? true : false });
  }, [enableAudio, setCtrls]);

  useFrame(() => {
    if (!tree1Mat || !audio?.started || !ctrls.musicToggle) return;
    
    audio.update(); 
    //const avg = audio.update();    
    
    //const t1 = Math.max(.2, gsap.utils.mapRange(30, 55, 0, .5, avg));
    //tree1Mat.uniforms.uTurbFactor.value = t1;
    let t2 = audio.data[4];
    const h = savedVal.current*.7 + gsap.utils.mapRange(50, 250, .4, 1.7, t2);
    houseMat.uniforms.uLight4Strength.value = h;
    groundMat.uniforms.uLight4Strength.value = h;
    t2 = Math.max(.07, gsap.utils.mapRange(20, 60, .1, .33, t2));
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
