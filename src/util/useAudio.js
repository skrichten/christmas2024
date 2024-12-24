import { useEffect } from 'react';
import { suspend } from 'suspend-react'

export default function useAudio(url, fftSize) {
  const audio = suspend(() => createAudio(url, fftSize), [url, fftSize])
  useEffect(() => {
    if (!url) return;
    // Connect the gain node, which plays the audio
    audio.gain.connect(audio.context.destination);
    // Disconnect it on unmount
    return () => {
      audio.gain.disconnect();
      audio.source.disconnect();
      audio.context.close();
    }
  }, [audio, url])
  return audio;
}


async function createAudio(url, fftSize) {
  if (!url) return null;
  // Fetch audio data and create a buffer source
  const res = await fetch(url)
  const buffer = await res.arrayBuffer()
  const context = new (window.AudioContext || window.webkitAudioContext)()
  const source = context.createBufferSource()
  source.buffer = await new Promise((res) => context.decodeAudioData(buffer, res))
  source.loop = true
  //This Will not work in safari
  source.start(0)
  // Create gain node and an analyser
  const gain = context.createGain()
  const analyser = context.createAnalyser()
  analyser.fftSize = fftSize
  source.connect(analyser)
  analyser.connect(gain)
  // The data array receive the audio frequencies
  const data = new Uint8Array(analyser.frequencyBinCount)
  return {
    context,
    source,
    gain,
    data,
    // This function gets called every frame per audio source
    update: () => {
      analyser.getByteFrequencyData(data)
      // Calculate a frequency average
      return (data.avg = data.reduce((prev, cur) => prev + cur / data.length, 0))
    },
  }
}
