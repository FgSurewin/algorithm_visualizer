import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook that encapsulates all playback logic for the visualizer.
 * Manages step state, auto-play interval, and provides control callbacks.
 */
export default function usePlayback(algorithm) {
  const [data, setData] = useState(algorithm.defaultData);
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const timerRef = useRef(null);
  const prevAlgoIdRef = useRef(algorithm.id);

  // Re-generate steps when algorithm or data changes
  useEffect(() => {
    // Reset data if algorithm changed
    if (prevAlgoIdRef.current !== algorithm.id) {
      const newData = algorithm.defaultData || generateRandomData();
      setData(newData);
      prevAlgoIdRef.current = algorithm.id;
      return; // data state update will trigger this effect again
    }

    const newSteps = algorithm.generateSteps(data);
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [algorithm, data]);

  // Auto-play interval
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, speed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, steps, speed]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);
  const goToStart = useCallback(() => setCurrentStepIdx(0), []);
  const stepForward = useCallback(() => {
    setCurrentStepIdx((prev) => Math.min(steps.length - 1, prev + 1));
  }, [steps.length]);
  const stepBack = useCallback(() => {
    setCurrentStepIdx((prev) => Math.max(0, prev - 1));
  }, []);
  const randomizeData = useCallback(() => {
    const newData = Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 10);
    setData(newData);
  }, []);

  const defaultStep = {
    array: data,
    highlights: [],
    comparing: [],
    swapping: [],
    sorted: [],
    message: 'Initializing...',
  };

  return {
    steps,
    currentStepIdx,
    currentStep: steps[currentStepIdx] || defaultStep,
    isPlaying,
    speed,
    totalSteps: steps.length,
    setSpeed,
    play,
    pause,
    togglePlay,
    goToStart,
    stepForward,
    stepBack,
    randomizeData,
  };
}
